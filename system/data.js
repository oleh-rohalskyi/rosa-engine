module.exports = {
  langs: {
    common: "eo",
    scope: ["eo","uk"]
  },
  fragments: {
    "footer": {

    },
    "header": {

    },
    "features/hero": {

    },
    "auth": {
      signin: {
        login: {
          "multilangual": false,
          "data": {
            "common": {
              "less-then-4": "login mast be more than 6 simbols",
              "is-empty": "login can\'t be empty"
            }
          }
        },
        pass: {
          "multilangual": false,
          "data": {
            "common": {
              "less-then-4": "pass mast be more than 6 simbols",
              "is-empty": "pass can\'t be empty"
            }
          }
        },
        errors: {
          "multilangual": false,
          "data": {
            "common": {
              "ER_DUP_ENTRY": "user already exist",
              "ECONNREFUSED": "limit done"
            }
          }
        }
      },
      signup: {
        login: {
          "multilangual": false,
          "data": {
            "common": {
              "less-then-4": "login mast be more than 6 simbols",
              "is-empty": "login can\'t be empty"
            }
          }

        },
        pass: {
          "multilangual": false,
          "data": {
            "common": {
              "less-then-4": "pass mast be more than 6 simbols",
              "is-empty": "pass can\'t be empty"
            }
          }
        },
        errors: {
          "multilangual": false,
          "data": {
            "common": {
              "ER_DUP_ENTRY": "user already exist",
              "ECONNREFUSED": "limit done"
            }
          }
        }
      }
    }
  },
  pages: {
    "404": {
      "error": true,
      "template": "404",
      multilangual: false,
      "pathnames": {
        common: "404"
      },
      "data": {
        common: {
          meta: {
            title: "",
            discription: "",
            robots: ""
          },
        }
      }
    },
    "tech-error": {
      "error": true,
      "template": "tech-error",
      "pathnames": {
        common: "404"
      },
      multilangual: false,
      "data": {
        common: {
          meta: {
            title: "",
            discription: "",
            robots: ""
          },
        }
      }
    },
    "home-redirect": {
      "redirect": true,
      to: {
        common: "домашняя",
        ru: "домашняя",
        en: "home"
      },
      "pathnames": {
        common: ""
      },
    },
    "home": {
      multilangual: false,
      "data": {
        common: {
          meta: {
            title: "",
            discription: "",
            robots: ""
          },
        }
      },
      "cashed": true,
      "template": "home",
      "multilangual": true,
      "pathnames": {
        common: "домашняя",
        ru: "домашня-сторінка",
        en: "home"
      },
    },
    "headbands": {
      "data": {
        common: {
          meta: {
            title: "",
            discription: "",
            robots: ""
          },
        }
      },
      "multilangual": false,
      "pathnames": {
        common: "банданы"
      },
      template: "headbands",
      "redirect": false,
      "childrens":
      {
        "one": {
          "data": {
            common: {
              meta: {
                title: "",
                discription: "",
                robots: ""
              },
            }
          },
          template: "headbands/one",
          "redirect": false,
          "multilangual": false,
          "pathnames": {
            common: "просмотр"
          }
        },
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
        "fragments": {
          "roles": [
            "admin"
          ],
          template: "admin/fragments",
          "redirect": false,
          "multilangual": false,
          "pathnames": {
            common: "pages"
          }
        }
      }
    }
  }
}
