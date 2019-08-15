const render = {
  go(response,{options,page,user,fragments}) {
   
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8;"
      });

      const fragmentsForThisPage = page.rf.dependencies
        .map(i=>i.split("/fragments/")[1])
          .filter(i=>!!i);

      const fr = {};

      console.log(fragmentsForThisPage);

      fragmentsForThisPage.forEach(element => {

        const frName = element.split(".pug")[0];

        if (fragments[frName].translations) {

          const values = fragments[frName].translations[options.lang];

          for (const key in values) {

              const value = values[key];

              if (!fr[frName])
                fr[frName] = {}
              
              fr[frName][key] = value;

          }
          
        } else {
          fr[frName] = {}
        }
        
        
      });

      if (page.data) {
        const data  = page.data[options.lang] || {};
        page.values = data;
        delete page.data;
      }
      
      const pugDat = {redirect: "",options,page,user,fragments:fr,reg: user.registered};
      
      console.log("log data :", pugDat);
      console.log("log fragments :", pugDat.fragments);

      const html = page.rf(pugDat);
      try {
      } catch (error) {
        console.log(error);
      }
      
      response.write(html);

      response.end();

  },
  goError(code, response, information) {

    
   
    const map = {
      404: {
        code: 404,
        errorMessage: information.errorMessage.toString(),
        type: "none",
        page: information.pages ? information.pages["404"] : {},
        path: "404"
      },
      415: {
        code: 415,
        errorMessage: "Unsupported Media Type",
        type: "media",
        page: information.pages["tech-error"],
        path: "404"
      },
      500: {
        code: process.env.NODE_ENV === 'dev' ? 500 : 501,
        errorMessage: information.errorMessage.toString(),
        type: information.type || "none",
        page: information.pages["tech-error"],
        path: "500"
      }
    };
    const payload = map[code];
    const mock = {
      options: {
        lang: "ru"
      },
      page: {
        fragments: "[]",
        pathnames: {
          current: payload.path
        },
        values: {
          title: payload.code,
          meta: {
            title: payload.code,
            discription: payload.code,
            robots: "none",
          }
        }
      }
    }
      
  
      response.writeHead(payload.code, {
        "Content-Type": "text/html; charset=utf-8;"
      });
      
      response.write(payload.page.rf({redirect: "yes",...payload,...mock,code}));

      response.end();
      
  }
} 
module.exports = render;