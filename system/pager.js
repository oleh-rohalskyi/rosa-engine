// const data = require('./data');

module.exports = {
  findPageByPathname(pages,requestURL,lang) {
    for (const key in pages) {
      const childPage = pages[key];
      const page = this.checkRoutes(
        childPage,
        childPage.path,
        requestURL
      );
      if (page)
        return page;
    }
  },
  checkRoutes(page,route,requestURL) {
    route = encodeURI(route);
    requestURL = encodeURI(requestURL);
    console.log(route,requestURL)
    if ( "/"+route === requestURL ) {
      console.log("page found => ", page.name);
      return page;
    }
    
    if (page.childrens) {

      const childrens = page.childrens;

      for (const key in childrens) {

        const childPage = childrens[key];
        // console.log(childPage);
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