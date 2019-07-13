const data = require('./data');

module.exports = {
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
    console.log(page);
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