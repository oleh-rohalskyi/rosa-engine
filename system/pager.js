const { precompilePage } = require("./compile")

module.exports = {
  async check(obj,mission) {
    switch(mission.key) {
      case "cashed":
        if(obj[mission.key] === mission.value) {
          obj.compiledFunction = await precompilePage(obj);
        }
    }
    
    if (obj.childrens) 
      for (var attr in obj.childrens)
        obj.childrens[attr] = await this.check(obj.childrens[attr], mission);

    return obj;
  },
  async fillCash(pages) {
        let cashed = await this.check({childrens:pages},{
          key: "cashed",
          value: true
        });
        return cashed.childrens;
  },
  findPageByPathname(pages,url,lang) {
    this.lang = lang;
    this.url = url;
    for (const key in pages) {
      const childPage = pages[key];
      let nextRoute = this.getRoute(childPage,this.lang);
      let route = (this.lang === "common") ?  "/" :  "/" + this.lang + "/";
      const page = this.checkRoutes(
        childPage,
        route + nextRoute,
      );
      if (page)
        return page;
    }
  },
  findRedirectPage(pages,newRoute) {
    this.url = encodeURI( (  (this.lang === "common") ?  "./" :  "./" + this.lang + "/"  )  + newRoute ) ;

    for (const key in pages) {
      
      const childPage = pages[key];
      let nextRoute = this.getRoute(childPage,this.lang);
      let route = (this.lang === "common") ?  "/" :  "/" + this.lang + "/";

      const page = this.checkRoutes(
        childPage,
        route + nextRoute,
      );

      if (page) 
        return page;
        
    }
  },
  getRoute(page) {
    return page.multilangual ? page.pathnames[this.lang] : page.pathnames.common;
  },
  checkRoutes(page,route) {
    console.log("=>",this.url,"." + encodeURI(route),"<=")
    if (this.url === "." + encodeURI(route)) {
      page.pathnames.current = route;
      return page;
    }
      
    if (page.childrens) {

      const childrens = page.childrens;

      for (const key in childrens) {

        const childPage = childrens[key];

        const nextRoute = this.getRoute(childPage);
        
        const page = this.checkRoutes(
          childPage,
          route + "/" + nextRoute
        );

        if (page) {
          page.pathnames.current = route + "/" + nextRoute;
          return page;
        }
          
      }

    }

    return null;

  }
}