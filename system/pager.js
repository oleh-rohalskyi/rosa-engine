// const data = require('./data');

module.exports = {
  findPageByPathname(pages,url,lang) {
    console.log("go page");
    this.lang = lang;
    this.url = url;
    for (const key in pages) {
      const childPage = pages[key];
      let route =  "/" + this.lang + "/";
      const page = this.checkRoutes(
        childPage,
        route + childPage.pathnames[lang],
      );
      if (page)
        return page;
    }
  },
  findRedirectPage(pages,newRoute) {

    this.url ="/" + encodeURI( newRoute );

    for (const key in pages) {
      
      const childPage = pages[key];

      let route =  "/" + this.lang + "/";

      const page = this.checkRoutes(
        childPage,
        route + childPage.pathnames[this.lang],
      );

      if (page) 
        return page;
        
    }
  },
  checkRoutes(page,route) {
    console.log( 
       this.lang, 
       ( "/" + this.lang + this.url ), 
      encodeURI(route), 
      "/"+(this.lang+this.url) === encodeURI(route) 
    )
    if ( ( "/" + this.lang + this.url ) === encodeURI(route) ) {
      console.log("page found")
      page.pathnames.current = route;
      return page;
    }
      
    if (page.childrens) {

      const childrens = page.childrens;

      for (const key in childrens) {

        const childPage = childrens[key];

        const nextRoute = childPage.pathnames[this.lang];
        
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