var inquirer = require('inquirer');
const puppeteer = require('puppeteer')
let page
let itemArr
let attrArr
let navLink = ["#nav_link_219", "#nav_link_3107", "#nav_link_61", "#nav_link_13"]
let pageWillBeOpenedPromise
let itemChoosen

 
async function openingBrowser() {
    let browserWillBeLaunchedPromise = await puppeteer.launch(
        {
            headless: null,
            defaultViewport: null,
            // visibility:false,
            args: ['--start-maximized']
        }
    )
        .then(async function (browserInstance) {
            let newTabPromise = await browserInstance.newPage()
            return newTabPromise
        }).then(async function (newTab) {
            // console.log('new tab opened')
            page = newTab
            pageWillBeOpenedPromise = await newTab.goto('https://www.jiomart.com/')
            return pageWillBeOpenedPromise
        }).then(function () {
            displayList()
        })
}

openingBrowser()

function displayList() {
    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'selection',
                message: 'Main menu:',
                choices: ['Fruits & Vegetable', 'Premium Fruits', 'Dairy & Bakery', 'Staples']
            }
        ])
        .then(function (answer) {
            itemChoosen=answer.selection
            // Use user feedback for... whatever!!
            switch (answer.selection) {
                case 'Fruits & Vegetable':
                    productListScrapper(navLink[0])
                    console.log(answer)

                    break;
                case 'Premium Fruits':
                    productListScrapper(navLink[1])
                    console.log(answer)

                    break;
                case 'Dairy & Bakery':
                    productListScrapper(navLink[2])
                    console.log(answer)

                    break;
                case 'Staples':
                    productListScrapper(navLink[3])
                    console.log(answer)

                    break;
                default:
                    console.log('invalid selection')
            }
        })
}
//  displayList()





function productListScrapper(navLink) {
    return new Promise( function (resolve, reject) {
        
        let selectedOptionClicked =  page.click(navLink,{delay:100})
        // return selectedOptionClicked 
        selectedOptionClicked.then(function () {
            let waitForPromise = page.waitForSelector('.col-md-3.p-0 .clsgetname')

            return waitForPromise
        }).then(async function () {
            // let itemArr= page.$$('.col-md-3.p-0 .clsgetname')

            itemArr = await page.evaluate(() =>
                Array.from(
                    document.querySelectorAll('.col-md-3.p-0 .clsgetname'),
                    (element) => element.textContent
                )
            )
            return itemArr
        }).then(async function () {
            // let addToCartArr= ('').attr('data-sku')
            attrArr = await page.$$eval(".col-md-3.p-0 button", el => el.map(x => x.getAttribute("data-sku")));
            // console.log(attrArr)
            return attrArr

        })
            .then(function (attrArr) {
                // console.log(itemArr+"")
                // displayObj.headless=null
                choosenTypeOfProducts(itemArr, attrArr)
            })
            .then(function () {
                resolve()
            }).catch(function () {
                reject()
            })
    })
}


function choosenTypeOfProducts(itemArr, attrArr) {



    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                message:itemChoosen,
                name: 'selection',
                choices: itemArr
            }
        ])
        .then(function (answer) {
            let index = itemArr.indexOf((answer.selection).trim());
            
            // let addToCartArrClicked = page.click('.col-md-3.p-0 button[data-sku="' + attrArr[index] + '"] .add_plus')
            let addToCartArrClicked = page.click('.col-md-3.p-0 button[data-sku="' + attrArr[index] + '"]')
            // let addToCartArrClicked = page.click('#mstar_box > div > div > div > div:nth-child('+(index+1)+') > div > div.cart_btn > button')

            


            displayNext()
        })
}


function displayNext() {

    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'selection',
                message:'More Options:',
                choices: ['Go Back To Previous Menu', 'Go Back To Main Menu', 'Exit And Proceed To CheckOut']
            }
        ])
        .then(async function (answer) {
            // Use user feedback for... whatever!!
            if (answer.selection == 'Go Back To Previous Menu') {
                // await page.waitForTimeout(4000)
                choosenTypeOfProducts(itemArr, attrArr)
            }
            else if (answer.selection == 'Go Back To Main Menu') {
                displayList()
            }
            else if (answer.selection == 'Exit And Proceed To CheckOut') {
                // page.defaultViewport
                let goToCartPromise = page.click('.cart_text .text')
                

                console.log('Opening Cart')
            }

        })

}







//payment is done manually as it requires important credentials
// thank you 




