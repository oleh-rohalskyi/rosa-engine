module.exports = {
  fragments: {
    "header": {

    },
    "features/hero" : {

    },
    "auth": {
      signin: {
        login: {
          "less-then-4": "login mast be more than 6 simbols",
          "is-empty": "login can\'t be empty"
        },
        pass: {
          "less-then-4": "pass mast be more than 6 simbols",
          "is-empty": "pass can\'t be empty"
        },
        errors: {
          "ER_DUP_ENTRY": "user already exist",
          "ECONNREFUSED": "limit done"
        }
      },
      signup: {
        login: {
          "less-then-4": "login mast be more than 6 simbols",
          "is-empty": "login can\'t be empty"
        },
        pass: {
          "less-then-4": "pass mast be more than 6 simbols",
          "is-empty": "pass can\'t be empty"
        },
        errors: {
          "ER_DUP_ENTRY": "user already exist",
          "ECONNREFUSED": "limit done"
        }
      }
    }
  },
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
    "headbands": {
      "multilangual": false,
      "pathnames": {
        common: "shop"
      },
      template: "arhxivo",
      "redirect": false,
      "childrens": 
        {
          "uno-arhxivo": {
            template: "headbands/one",
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
    },
    "admin": {
      template: "admin",
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
            template: "admin/pages",
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
