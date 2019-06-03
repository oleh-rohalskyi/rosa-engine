module.exports = {
  pages: {
    "home-redirect": {
      "redirect": true,
      to: {
        common: "cĥefpago",
        uk: "домашня-сторінка",
        eo: "cĥefpago"
      },
      "pathnames": {
        common: ""
      },
    },
    "home": {
      "cashed": true,
      "template": "index",
      "redirect": false,
      "childrens": null,
      "multilangual": true,
      "pathnames": {
        common: "cĥefpago",
        uk: "домашня-сторінка",
        eo: "cĥefpago"
      },
    },
    "arhiv": {
      template: "arhxivo/",
      "redirect": false,
      "childrens": 
        {
          "uno-arhxivo": {
            template: "arhxivo/uno-arhxivo",
            "redirect": false,
            "multilangual": false,
            "pathnames": {
              common: "uno-arĥivo"
            }
          },
          "aldoni": {
            template: "arhxivo/aldoni",
            "redirect": false,
            "multilangual": false,
            "pathnames": {
              common: "aldoni"
            }
          }
        }
      ,
      "multilangual": false,
      "pathnames": {
        common: "arĥivo"
      }
    },
    "admin": {
      template: "../../system/views/admin",
      "redirect": false,
      "multilangual": false,
      "roles": [
        "admin"
      ],
      "pathnames": {
        common: "admin"
      },
      "childrens": {
          "pages": {
            "roles": [
              "admin"
            ],
            template: "../../system/views/pages",
            "redirect": false,
            "multilangual": false,
            "pathnames": {
              common: "pages"
            }
          },
        }
    }
  }
}
