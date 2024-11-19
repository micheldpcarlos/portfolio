export const json = {
  "logo": "https://api.surveyjs.io/private/Surveys/files?name=09c9faa7-52b9-48d7-a155-e01f1dad7e2f",
  "logoWidth": "auto",
  "logoHeight": "64",
  "completedHtml": "<div style=\"max-width:640px;text-align:center;margin:0px auto 16px auto;\">\n\n<div style=\"background-color:#6239B0;padding:40px 64px 48px 64px;\">\n<h4 style=\"color:#fff;\">Order received.</h4>\n<br>\n<p style=\"color:#fff;\">Your purchase is on its way. We've sent a confirmation email with order details to your inbox. If you have any inquiries or require further assistance, our customer support team is here to help. \n<br><br>\nThanks for choosing us.</p>\n</div>\n\n</div>",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "paneldynamic",
          "name": "products",
          "width": "100%",
          "title": "SELECT A PRODUCT",
          "titleLocation": "top",
          "defaultValue": [
            {
              "t-shirt-colors": "https://api.surveyjs.io/private/Surveys/files?name=facda824-2734-478c-90ac-db94ef35c28a",
              "jacket-colors": "https://api.surveyjs.io/private/Surveys/files?name=3a492458-6aab-418a-84e5-bb62f83166b1",
              "sneakers-colors": "https://api.surveyjs.io/private/Surveys/files?name=d514d65e-5f74-40a6-abfd-43cc7fa76fda",
              "product-type": "T-Shirt",
              "qty": "1",
              "clothing-material": "Recycled Polyester",
              "clothing-size": "M",
              "clothing-size-chart": {
                "pos": {
                  "start": 1442,
                  "end": 2227
                },
                "S": {
                  "pos": {
                    "start": 1461,
                    "end": 1590
                  },
                  "Neck": "14.5",
                  "Sleeve": "34",
                  "Chest": "35–37",
                  "Waist": "29.5–31.5"
                },
                "M": {
                  "pos": {
                    "start": 1610,
                    "end": 1747
                  },
                  "Neck": "15–15.5",
                  "Sleeve": "34.5–35",
                  "Chest": "38–40",
                  "Waist": "32.5–34.5"
                },
                "L": {
                  "pos": {
                    "start": 1767,
                    "end": 1904
                  },
                  "Neck": "16–16.5",
                  "Sleeve": "35.5–36",
                  "Chest": "42–44",
                  "Waist": "36.5–38.5"
                },
                "XL": {
                  "pos": {
                    "start": 1924,
                    "end": 2061
                  },
                  "Neck": "17–17.5",
                  "Sleeve": "36.5–37",
                  "Chest": "46–48",
                  "Waist": "40.5–42.5"
                },
                "XXL": {
                  "pos": {
                    "start": 2081,
                    "end": 2218
                  },
                  "Neck": "18–18.5",
                  "Sleeve": "37.5–38",
                  "Chest": "50–52",
                  "Waist": "44.5–46.5"
                }
              },
              "sneakers-material": "100% Faux Leather",
              "sneakers-size": "8.5",
              "sneakers-size-chart": {
                "6": {
                  "pos": {
                    "start": 2355,
                    "end": 2416
                  },
                  "UK Size": "5",
                  "EU Size": "38.5"
                },
                "7": {
                  "pos": {
                    "start": 2432,
                    "end": 2493
                  },
                  "UK Size": "6",
                  "EU Size": "39.5"
                },
                "8": {
                  "pos": {
                    "start": 2509,
                    "end": 2568
                  },
                  "UK Size": "7",
                  "EU Size": "41"
                },
                "9": {
                  "pos": {
                    "start": 2584,
                    "end": 2643
                  },
                  "UK Size": "8",
                  "EU Size": "42"
                },
                "10": {
                  "pos": {
                    "start": 2660,
                    "end": 2719
                  },
                  "UK Size": "9",
                  "EU Size": "43"
                },
                "11": {
                  "pos": {
                    "start": 2736,
                    "end": 2796
                  },
                  "UK Size": "10",
                  "EU Size": "45"
                },
                "12": {
                  "pos": {
                    "start": 2813,
                    "end": 2873
                  },
                  "UK Size": "11",
                  "EU Size": "46"
                },
                "pos": {
                  "start": 2340,
                  "end": 3365
                },
                "6.5": {
                  "pos": {
                    "start": 2891,
                    "end": 2952
                  },
                  "UK Size": "5.5",
                  "EU Size": "39"
                },
                "7.5": {
                  "pos": {
                    "start": 2970,
                    "end": 3031
                  },
                  "UK Size": "6.5",
                  "EU Size": "40"
                },
                "8.5": {
                  "pos": {
                    "start": 3049,
                    "end": 3112
                  },
                  "UK Size": "7.5",
                  "EU Size": "41.5"
                },
                "9.5": {
                  "pos": {
                    "start": 3130,
                    "end": 3193
                  },
                  "UK Size": "8.5",
                  "EU Size": "42.5"
                },
                "10.5": {
                  "pos": {
                    "start": 3212,
                    "end": 3273
                  },
                  "UK Size": "9.5",
                  "EU Size": "44"
                },
                "11.5": {
                  "pos": {
                    "start": 3292,
                    "end": 3356
                  },
                  "UK Size": "10.5",
                  "EU Size": "45.5"
                }
              }
            }
          ],
          "templateElements": [
            {
              "type": "dropdown",
              "name": "product-type",
              "width": "70%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Product",
              "choices": [
                "T-Shirt",
                "Sneakers",
                "Jacket"
              ],
              "choicesOrder": "random",
              "placeholder": "Select a product…",
              "allowClear": false
            },
            {
              "type": "dropdown",
              "name": "qty",
              "width": "30%",
              "minWidth": "144px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Quantity",
              "setValueIf": "{panel.product-type} notempty",
              "setValueExpression": "'1'",
              "choices": [ 1, 2, 3, 4, 5 ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "image",
              "name": "t-shirt",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'T-Shirt'",
              "width": "50%",
              "minWidth": "224px",
              "imageLink": "{panel.t-shirt-colors}",
              "imageFit": "cover",
              "imageHeight": "auto",
              "imageWidth": "1000"
            },
            {
              "type": "imagepicker",
              "name": "t-shirt-colors",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'T-Shirt'",
              "width": "50%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "defaultValue": "https://api.surveyjs.io/private/Surveys/files?name=facda824-2734-478c-90ac-db94ef35c28a",
              "choices": [
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=e51dcbdf-2f8b-4770-828b-610583587e3f",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a9c2e950-4066-4263-bf02-f68f5ba31e62"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=4446e7d2-9a9b-45af-baae-bc2773331ae0",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=cc6a36e0-e332-4c46-8637-1e15f1eef229"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=facda824-2734-478c-90ac-db94ef35c28a",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=b44a0a43-7f35-42eb-818e-269881047632"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=9995584c-2cd0-4629-bae8-83deb90de0f8",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=bf448beb-e73b-4350-a008-d9bc57e9795b"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=d8da6e40-a7e3-423a-b32b-fa18dc9222d4",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a3bc912e-7925-45c7-bf27-4757743e0a60"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=60840717-c76b-4eb9-b569-7239daa93616",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=26138806-03ee-4509-a044-fd876ffd8b6c"
                }
              ],
              "imageHeight": 64,
              "imageWidth": 64,
              "minImageWidth": "",
              "minImageHeight": "",
              "maxImageWidth": "",
              "maxImageHeight": ""
            },
            {
              "type": "image",
              "name": "jacket",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Jacket'",
              "width": "50%",
              "minWidth": "224px",
              "imageLink": "{panel.jacket-colors}",
              "imageFit": "cover",
              "imageHeight": "auto",
              "imageWidth": "1000"
            },
            {
              "type": "imagepicker",
              "name": "jacket-colors",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Jacket'",
              "width": "50%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "defaultValue": "https://api.surveyjs.io/private/Surveys/files?name=3a492458-6aab-418a-84e5-bb62f83166b1",
              "choices": [
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=1a50faa1-a207-4e76-af3d-756fa4e73d62",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a9c2e950-4066-4263-bf02-f68f5ba31e62"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=3a492458-6aab-418a-84e5-bb62f83166b1",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=cc6a36e0-e332-4c46-8637-1e15f1eef229"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=947a25ac-12a8-43c1-9c3a-9fb4d8e3e73a",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=b44a0a43-7f35-42eb-818e-269881047632"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=c9330d4c-fab5-41b7-8792-f227a1be6b95",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=bf448beb-e73b-4350-a008-d9bc57e9795b"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=79cffa29-f657-4998-ad44-6b823a81119c",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a3bc912e-7925-45c7-bf27-4757743e0a60"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=629e4285-80ff-43dc-a5b2-de277b518024",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=26138806-03ee-4509-a044-fd876ffd8b6c"
                }
              ],
              "imageHeight": 64,
              "imageWidth": 64,
              "minImageWidth": "",
              "minImageHeight": "",
              "maxImageWidth": "",
              "maxImageHeight": ""
            },
            {
              "type": "image",
              "name": "Sneakers",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "50%",
              "minWidth": "224px",
              "imageLink": "{panel.sneakers-colors}",
              "imageFit": "cover",
              "imageHeight": "auto",
              "imageWidth": "1000"
            },
            {
              "type": "imagepicker",
              "name": "sneakers-colors",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "50%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "defaultValue": "https://api.surveyjs.io/private/Surveys/files?name=d514d65e-5f74-40a6-abfd-43cc7fa76fda",
              "choices": [
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=d514d65e-5f74-40a6-abfd-43cc7fa76fda",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a9c2e950-4066-4263-bf02-f68f5ba31e62"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=b8628572-6b64-45a6-93fd-590a6f0f851e",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=cc6a36e0-e332-4c46-8637-1e15f1eef229"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=a71f1e3d-cc5d-4dea-b760-e2a9970ee4f8",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=b44a0a43-7f35-42eb-818e-269881047632"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=b8b48d79-2065-4afe-bbbd-22ebea6b7505",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=bf448beb-e73b-4350-a008-d9bc57e9795b"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=336f1fc4-b9ce-4ba8-a04c-90abe38aeb78",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a3bc912e-7925-45c7-bf27-4757743e0a60"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=8a53acab-d64a-4afa-912e-dcc277d8f18b",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=26138806-03ee-4509-a044-fd876ffd8b6c"
                }
              ],
              "imageHeight": 64,
              "imageWidth": 64,
              "minImageWidth": "",
              "minImageHeight": "",
              "maxImageWidth": "",
              "maxImageHeight": ""
            },
            {
              "type": "dropdown",
              "name": "sneakers-material",
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "50%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Material",
              "setValueIf": "{panel.product-type} = 'Sneakers'",
              "setValueExpression": "'100% Faux Leather'",
              "choices": [
                "100% Faux Leather",
                "100% Synthetic"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "dropdown",
              "name": "sneakers-size",
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "20%",
              "minWidth": "128px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Size",
              "setValueIf": "{panel.product-type} = 'Sneakers'",
              "setValueExpression": "'8.5'",
              "choices": [
                "6",
                "6.5",
                "7",
                "7.5",
                "8",
                "8.5",
                "9",
                "9.5",
                "10",
                "10.5",
                "11"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "checkbox",
              "name": "sneakers-size-chart-selector",
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "30% ",
              "minWidth": "144px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "resetValueIf": "{panel.product-type} <> 'Sneakers'",
              "choices": [
                {
                  "value": "true",
                  "text": "Show Size Chart"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "clothing-material",
              "visibleIf": "{panel.product-type} <> 'Sneakers'",
              "width": "50%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Material",
              "setValueIf": "{panel.product-type} <> 'Sneakers'",
              "setValueExpression": "'Recycled Polyester'",
              "choices": [
                "Recycled Polyester",
                "Polyester",
                "100% Cotton"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "dropdown",
              "name": "clothing-size",
              "visibleIf": "{panel.product-type} <> 'Sneakers'",
              "width": "20%",
              "minWidth": "128px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Size",
              "setValueIf": "{panel.product-type} <> 'Sneakers'",
              "setValueExpression": "'M'",
              "choices": [
                "S",
                "M",
                "L",
                "XL",
                "XXL"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "checkbox",
              "name": "clothing-size-chart-selector",
              "visibleIf": "{panel.product-type} <> 'Sneakers'",
              "width": "30% ",
              "minWidth": "144px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "resetValueIf": "{panel.product-type} = 'Sneakers'",
              "choices": [
                {
                  "value": "true",
                  "text": "Show Size Chart"
                }
              ]
            },
            {
              "type": "matrixdropdown",
              "name": "clothing-size-chart",
              "visibleIf": "{panel.clothing-size-chart-selector} = ['true'] and {panel.product-type} <> 'Sneakers'",
              "minWidth": "256px",
              "title": "SIZE CHART",
              "description": "All sizes are in inches.",
              "descriptionLocation": "underTitle",
              "defaultValue": {
                "S": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 14927,
                        "end": 14990
                      },
                      "start": 12962,
                      "end": 15051
                    },
                    "start": 14697,
                    "end": 15181
                  },
                  "Neck": "14.5",
                  "Sleeve": "34",
                  "Chest": "35–37",
                  "Waist": "29.5–31.5"
                },
                "M": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 15238,
                        "end": 15301
                      },
                      "start": 13190,
                      "end": 15362
                    },
                    "start": 14846,
                    "end": 15500
                  },
                  "Neck": "15–15.5",
                  "Sleeve": "34.5–35",
                  "Chest": "38–40",
                  "Waist": "32.5–34.5"
                },
                "L": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 15557,
                        "end": 15620
                      },
                      "start": 13426,
                      "end": 15681
                    },
                    "start": 15003,
                    "end": 15819
                  },
                  "Neck": "16–16.5",
                  "Sleeve": "35.5–36",
                  "Chest": "42–44",
                  "Waist": "36.5–38.5"
                },
                "XL": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 15876,
                        "end": 15939
                      },
                      "start": 13662,
                      "end": 16000
                    },
                    "start": 15160,
                    "end": 16138
                  },
                  "Neck": "17–17.5",
                  "Sleeve": "36.5–37",
                  "Chest": "46–48",
                  "Waist": "40.5–42.5"
                },
                "XXL": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 16195,
                        "end": 16258
                      },
                      "start": 13898,
                      "end": 16319
                    },
                    "start": 15317,
                    "end": 16457
                  },
                  "Neck": "18–18.5",
                  "Sleeve": "37.5–38",
                  "Chest": "50–52",
                  "Waist": "44.5–46.5"
                }
              },
              "alternateRows": true,
              "columns": [
                { "name": "Neck" },
                { "name": "Sleeve" },
                { "name": "Chest" },
                { "name": "Waist" }
              ],
              "cellType": "expression",
              "rows": [ "S", "M", "L", "XL", "XXL" ],
              "rowTitleWidth": "64px"
            },
            {
              "type": "matrixdropdown",
              "name": "sneakers-size-chart",
              "visibleIf": "{panel.sneakers-size-chart-selector} = ['true'] and {panel.product-type} = 'Sneakers'",
              "minWidth": "256px",
              "title": "SIZE CHART",
              "descriptionLocation": "underTitle",
              "defaultValue": {
                "6": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 17728,
                        "end": 17791
                      },
                      "start": 15348,
                      "end": 17852
                    },
                    "start": 16688,
                    "end": 17914
                  },
                  "UK Size": "5",
                  "EU Size": "38.5"
                },
                "7": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 17967,
                        "end": 18030
                      },
                      "start": 15504,
                      "end": 18091
                    },
                    "start": 16765,
                    "end": 18153
                  },
                  "UK Size": "6",
                  "EU Size": "39.5"
                },
                "8": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 18206,
                        "end": 18269
                      },
                      "start": 15660,
                      "end": 18330
                    },
                    "start": 16842,
                    "end": 18390
                  },
                  "UK Size": "7",
                  "EU Size": "41"
                },
                "9": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 18443,
                        "end": 18506
                      },
                      "start": 15814,
                      "end": 18567
                    },
                    "start": 16917,
                    "end": 18627
                  },
                  "UK Size": "8",
                  "EU Size": "42"
                },
                "10": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 18681,
                        "end": 18744
                      },
                      "start": 15969,
                      "end": 18805
                    },
                    "start": 16993,
                    "end": 18865
                  },
                  "UK Size": "9",
                  "EU Size": "43"
                },
                "11": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 18919,
                        "end": 18982
                      },
                      "start": 16124,
                      "end": 19043
                    },
                    "start": 17069,
                    "end": 19104
                  },
                  "UK Size": "10",
                  "EU Size": "45"
                },
                "12": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 19158,
                        "end": 19221
                      },
                      "start": 16280,
                      "end": 19282
                    },
                    "start": 17146,
                    "end": 19343
                  },
                  "UK Size": "11",
                  "EU Size": "46"
                },
                "6.5": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 19398,
                        "end": 19461
                      },
                      "start": 16437,
                      "end": 19522
                    },
                    "start": 17224,
                    "end": 19584
                  },
                  "UK Size": "5.5",
                  "EU Size": "39"
                },
                "7.5": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 19639,
                        "end": 19702
                      },
                      "start": 16595,
                      "end": 19763
                    },
                    "start": 17303,
                    "end": 19825
                  },
                  "UK Size": "6.5",
                  "EU Size": "40"
                },
                "8.5": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 19880,
                        "end": 19943
                      },
                      "start": 16753,
                      "end": 20004
                    },
                    "start": 17382,
                    "end": 20068
                  },
                  "UK Size": "7.5",
                  "EU Size": "41.5"
                },
                "9.5": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 20123,
                        "end": 20186
                      },
                      "start": 16913,
                      "end": 20247
                    },
                    "start": 17463,
                    "end": 20311
                  },
                  "UK Size": "8.5",
                  "EU Size": "42.5"
                },
                "10.5": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 20367,
                        "end": 20430
                      },
                      "start": 17074,
                      "end": 20491
                    },
                    "start": 17545,
                    "end": 20553
                  },
                  "UK Size": "9.5",
                  "EU Size": "44"
                },
                "11.5": {
                  "pos": {
                    "pos": {
                      "pos": {
                        "start": 20609,
                        "end": 20672
                      },
                      "start": 17233,
                      "end": 20733
                    },
                    "start": 17625,
                    "end": 20798
                  },
                  "UK Size": "10.5",
                  "EU Size": "45.5"
                }
              },
              "alternateRows": true,
              "columns": [
                {
                  "name": "UK Size"
                },
                {
                  "name": "EU Size"
                }
              ],
              "cellType": "expression",
              "rows": [
                "6",
                "6.5",
                "7",
                "7.5",
                "8",
                "8.5",
                "9",
                "9.5",
                "10",
                "10.5",
                "11",
                "11.5",
                "12"
              ]
            }
          ],
          "noEntriesText": "There are no products yet.\nClick the button below to add a new product.",
          "confirmDelete": true,
          "confirmDeleteText": "Do you want to remove the product?",
          "panelAddText": "+ Product",
          "panelRemoveText": "Remove",
          "showProgressBar": false
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "panel",
          "name": "customer-details",
          "elements": [
            {
              "type": "text",
              "name": "full-name",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Full Name"
            },
            {
              "type": "text",
              "name": "phone",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Phone Number"
            },
            {
              "type": "text",
              "name": "email",
              "width": "60%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Email Address"
            },
            {
              "type": "text",
              "name": "billing-address",
              "width": "60%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Billing Address"
            },
            {
              "type": "dropdown",
              "name": "country",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Country",
              "choicesByUrl": {
                "url": "https://surveyjs.io/api/CountriesExample"
              },
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "text",
              "name": "city",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "City"
            },
            {
              "type": "text",
              "name": "state",
              "width": "20%",
              "minWidth": "88px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "State"
            },
            {
              "type": "text",
              "name": "zip",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Zip Code"
            }
          ],
          "title": "CUSTOMER DETAILS",
          "width": "100%"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "panel",
          "name": "shipping-details",
          "elements": [
            {
              "type": "radiogroup",
              "name": "shipping-method",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "defaultValue": "Item 1",
              "choices": [ "Standard", "Express", "Tracked" ],
              "colCount": 0
            },
            {
              "type": "text",
              "name": "shipping-address",
              "width": "60%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Shipping Address"
            },
            {
              "type": "dropdown",
              "name": "shipping-country",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Country",
              "choicesByUrl": {
                "url": "https://surveyjs.io/api/CountriesExample"
              },
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "text",
              "name": "shipping-city",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "City"
            },
            {
              "type": "text",
              "name": "shipping-state",
              "width": "20%",
              "minWidth": "88px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "State"
            },
            {
              "type": "text",
              "name": "shipping-zip",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Zip Code"
            },
            {
              "type": "comment",
              "name": "further-instructions",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Further Instructions",
              "autoGrow": true,
              "allowResize": false
            }
          ],
          "title": "SHIPPING DETAILS",
          "width": "100%"
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "panel",
          "name": "checkout",
          "elements": [
            {
              "type": "text",
              "name": "card-number",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Card Number"
            },
            {
              "type": "text",
              "name": "card-exp-date",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Expiration Date",
              "inputType": "date"
            },
            {
              "type": "text",
              "name": "card-cvc",
              "width": "20%",
              "minWidth": "88px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "CVC"
            },
            {
              "type": "text",
              "name": "cardholder-name",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Cardholder Name"
            }
          ],
          "title": "PAYMENT",
          "width": "100%"
        }
      ]
    }
  ],
  "showPrevButton": false,
  "showQuestionNumbers": "off",
  "questionDescriptionLocation": "underInput",
  "pageNextText": "PROCEED",
  "completeText": "PLACE ORDER",
  "widthMode": "static",
  "width": "904",
  "fitToContainer": true
};