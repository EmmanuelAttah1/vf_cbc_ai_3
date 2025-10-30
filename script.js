const address = "https://vf-cbc-ai-server.onrender.com"
const messages = document.getElementById("messages")

const imagePaths = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBbtzmUzgea6ImBa4q3fk7Ay4jbTjLAK0L7JVR5el2NxauUoc790GtAWmF8jclZOil8nAK_iDgEYO7BpYRJ7SWSCQpd3UIkA4UKv0tarpC8JQrSReIr3a__k-0taUEQPlo2ZD0N3Pd9OEeLlAFryFSm8SZpKxkOJykngBnyw-dVhgZopiBL1WRW_P898OERmjXe6mfmFRTbo6L1b18xup0hKHTk97BfjQB_eRLnVF8PhxxgGHb5ygnbS81QMWjlFJDALZJkhT1jDTLp",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFUwmQyV0TqSACAuuNYbvPStEvgOiqFOXjJhncmm0Zmxip9mmMPu4hF9F6eovDT1POwgcUGq58I1xxfjdOZOpy_RJulnFbnwcDdZFvnwbXpBdBhEoI3gIWehDY4ySukH4MQXz9zwCCDHMEu-XjrfZkDB9lY2frynuA_wmxDbbHee_SSJK5J25a5teGXcVfq4PEfcuhDd4-Jcne1ks_5TCCL2Fj_2PkzkN6jw7_pMn-b4IfOjjXdr88ytvkkVOB2xorQzhX3Zh0TDye",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDd9AeEw0Y-KeS7KsXxSx-y0uj_nXOu5d8Zm8MLQmKvfmkQOXsi_PmMAviMb--EGB5KCnCQcp8gDfK1lbSxuo7iM5gW93RbYUkyBIP3o46uyqXZtaR6IY61o6JoCOpF5fpYkKjrTASduFOfC4_Wyl_KyDK_-gSlV7J--0dqIUP6vwWGZs5647XWHltn6ROvwSmlvzQ5b6tVSWAsQF5MsvI-IIedFjCx6tl7qgOQBqcyOgcgFC0O9CQmI6I5cvJdZiiY5kIV9ZgKtce4"
]

const saveID=(id)=>{
    // key is visiola_cbc_ai_3
    localStorage.setItem("visiola_cbc_ai_3",id)
}

const generateId = () => {
    // generate a random string of length 4
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    saveID(id)
    return id
}

const getID=()=>{
    const id = localStorage.getItem("visiola_cbc_ai_3")
    if (id === undefined){
        generateId()
    }

    return localStorage.getItem("visiola_cbc_ai_3")
}

const goToChat=(field)=>{
    location = "chat_interface.html?field="+field
}

const getARandomPictureFromImagePaths=()=>{
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    return imagePaths[randomIndex];
}

const sendMessageToAPI = (method,endpoint,data={}) => {
    data["id"] = getID()
    return new Promise((resolve, reject) => {
        fetch(`${address}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`http_${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            // ensure callers get an Error object
            reject(err instanceof Error ? err : new Error(String(err)))
        })
    })
}


const sendMessage=(message=null)=>{
    const value = message? {value:message} : document.getElementsByTagName("input")[0]
    if(value !== undefined && value.value.length > 0){
        const msg = value.value
        console.log("sending message : ",value.value);
        setHummanMessage(value.value)
        value.value = ""
        setAIMessage("...")
        sendMessageToAPI("post","group3/",{message:msg})
        .then(res=>{
        console.log("recieved response ",res);
        removeLastMessage()
        setAIMessage(res.ai_response.response,res.ai_response.events,false)
        })
    }
}

const prepareListData=(data)=>{
    let msg = '<div class="pt-2 flex flex-wrap gap-2">'
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        msg += `<button
                onclick="sendMessage('${element}')"
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-secondary/20 text-secondary hover:bg-secondary/30">${element}</button>`
    }
    msg += "</div>"

    return msg
}

const prepareResultData=(data)=>{
    let msg = `
    <div class="relative">
              <div class="flex overflow-x-auto pb-6 -mx-4 px-4 gap-6"
                style="scrollbar-width: none; -ms-overflow-style: none;">
    `

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        msg += ` <div
        class="flex h-full flex-1 flex-col gap-4 rounded-xl bg-card-light dark:bg-card-dark shadow-sm min-w-72 w-72">
            <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl"
            data-alt="Python workshop graphic"
            style='background-image: url("${getARandomPictureFromImagePaths()}");'>
            </div>
            <div class="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
            <div>
                <p class="text-text-light dark:text-text-dark text-base font-bold leading-normal">
                ${element.name}</p>
                <p
                class="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal mt-1">
                ${element.description}</p>
                <p
                class="text-text-muted-light dark:text-text-muted-dark text-xs font-normal leading-normal mt-2">
                Date: ${element.date}</p>
            </div>
           <button
                onclick='sendMessage("Tell me more about ${element.name}")'
                class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide">Get More Details</button>
            </div>
            </div>`
            }
    
    msg += "</div></div>"

    return msg
}

const setAIMessage=(message,data=null, isList=false)=>{
    let messageData = `
        <div class="flex items-end gap-3">
              <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0"
                data-alt="Assist avatar"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtuVDxmmrwtFyyumqlfKjgF6eKehEZqxF3eXdZDACnU_1gHNhWJRaCy4fzhzAnPmluzM-n0cuYPFA_1Z3Erv62YI98KraYZU8gzmKfn5kjX3YLRawDxsP-9Bhi562EBCg09IE1xcvr2EgvvflEV9-PslNsQmKPirFFag7meQeBTlhQDxlmGuyAjEtqFMPeKu9uA36LtEZXenmP1dDVsd8a4aXRqlmCe7D4Sr_HxxJ-nFO61QYC-8xYszxMNHdCqt06TF9od0L8N_Iv");'>
              </div>

            <div class="flex flex-1 flex-col gap-1.5 items-start">
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Assist</p>
                <div class="bg-slate-200 dark:bg-slate-700 rounded-lg rounded-bl-none p-3 max-w-md">
                    <p class="text-base font-normal leading-normal text-slate-800 dark:text-slate-200">
                    ${message}
                    </p>
                </div>
        `

        if(data){
            if(isList){
                messageData += prepareListData(data)
            }else{
                messageData += prepareResultData(data)
            }
        }

        messageData += "</div></div>"

    messages.insertAdjacentHTML('beforeend',messageData)
}

const setHummanMessage=(message)=>{
    messages.insertAdjacentHTML('beforeend',`<div class="flex items-end gap-3 justify-end">
              <div class="flex flex-1 flex-col gap-1.5 items-end">
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">You</p>
                <div class="bg-primary rounded-lg rounded-br-none p-3 max-w-md">
                  <p class="text-base font-normal leading-normal text-white">${message}</p>
                </div>
              </div>
              <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0"
                data-alt="User avatar"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcIQH-ewCdmCD1qLN2UOfjHJ32wXt8uFTilAEaPI-azlAHpIxrwVz-_5KRXalfwTrqvKUa0xL-xOTPDW9tWre7VJeW4h6tcKGfcpq6KWMtuu4URjzl-Vl5q3v8hdhak_TN8wciHNavBHdHmBmpr8xrym9Pd1c4IUIkCDrTzIqbvGxPcm_zva_DTRLaRkl-yldajZg9NPo8MEEwq7PNg4BCabmqIe6aSu3DL6BTBPg2BI9LuCDddyJwDHJamD7HlIof_BEY7zoq22yY");'>
              </div>
            </div>`)
}

const removeLastMessage=()=>{
    const lastChild = messages.lastElementChild;
    if (lastChild) {
        messages.removeChild(lastChild);
    }
}


window.addEventListener("load",()=>{

    if(location.pathname === "/vf_cbc_ai_3/"){
        generateId()
    }
    
    setAIMessage(
        "Hi! I'm Assist, your personal guide to the world of STEM. I can help you find mentorships, workshops, competitions, and much more. What are you interested in today?",
        ["Find workshops near me","Show me competitions","Any other organizations?"],
        true)
})
