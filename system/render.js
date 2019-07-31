const render = {
  go(response,{options,page,user,fragments}) {
   
    // console.log(page);
   
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
        const data  = page.data[options.lang];
        page.values = data;
        delete page.data;
      }
      
      const pugDat = {options,page,user,fragments:fr};
      
      console.log("log data :", pugDat);
      console.log("log fragments :", pugDat.fragments);

      response.write(page.rf(pugDat))

      response.end();

  },
  goError(code, response, params) {
    // console.log(response);
   
    const map = {
      404: {
        code: 404,
        errorMessage: JSON.stringify(params.errorMessage),
      },
      415: {
        code: 415,
        errorMessage: "Unsupported Media Type",
      },
      500: {
        code: process.env.NODE_ENV === 'dev' ? 500 : 403,
        errorMessage: JSON.stringify(params.errorMessage),
      }
    };

      const payload = map[code];
      
      response.writeHead(500, {
        "Content-Type": "text/html; charset=utf-8;"
      });

      response.write("<h1>"+payload.code+"</h1><span>"+JSON.stringify(payload)+"</span>");

      response.end();
      
  }
} 
module.exports = render;