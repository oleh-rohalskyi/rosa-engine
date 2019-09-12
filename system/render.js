const config = require("./config");

const render = {
  go(response, { options, page, user },startTime) {

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8;"
    });

    const lang = options.lang;
    const pugDat = {
      langs: JSON.stringify(config.langs),
      redirect: page.redirect, 
      script: page.script,
      lang,
      user, 
      widgets: page.widgets, 
      reg: user.registered,
      name: page.name,
      data: page.data[lang],
      pathnames: page.pathnames,
      location: options.pathname,
      widgetsScript: page.widgetsScript,
      dev: config.env === "dev",
      time: startTime,
    };
  
    let html = "<div>text</div>";

    try {
      html = page.rf(pugDat);
    } catch (error) {
      console.log(error)
      this.goError(500,response,{errorMessage:error,options,page})
      return;
    }

    // response.write();
    // console.log(html);
    response.end(html);
  },
  goApi(data,response) {
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8;"
    });
    response.end( JSON.stringify(data) );
  },
  goError(code, response, info) {

    const tErrPage = info.pages.filter(page => page.name === "tech-error")[0];
    const e404 = info.pages.filter(page => page.name === "404")[0];
    const map = {
      404: {
        code,
        errorMessage: info.errorMessage ? info.errorMessage.toString() : "not Fount",
        type: "none",
        page: e404,
        path: "404"
      },
      415: {
        code,
        errorMessage: "Unsupported Media Type",
        type: "media",
        page: tErrPage,
        path: "404"
      },
      500: {
        code: process.env.NODE_ENV === 'dev' ? code : 501,
        errorMessage: info.errorMessage ? info.errorMessage.toString() : "server error",
        type: info.type || "none",
        page: tErrPage,
        path: "500"
      },
      503: {
        code,
        errorMessage: info.errorMessage ? info.errorMessage.toString() : "server error",
        type: info.type || "none",
        page: tErrPage,
        path: "500"
      }
    };

    const payload = map[code];
    
    const data = {
      meta: {
        title: code,
        discription: "none",
        robots: "norobots"
      }
    };
    
    response.writeHead(payload.code, {
      "Content-Type": "text/html; charset=utf-8;"
    });
    
    let html = "";
    try {
      html = payload.page.rf({ 
        user: {
          role: info.options.role
        },
        noredirect: "yes",
        ...payload,
        data,
        dev: info.options,
        time: Date.now()
      })
    } catch(e) {
      response.end("<pre>"+e.toString()+"</pre>");
    }

    response.end(html);

  }
}
module.exports = render;