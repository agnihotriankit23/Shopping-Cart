import items from './items.json'
import addGlobalEventListner from './util/addGlobalEventListner.js'
import formatCurrency from './util/formatCurrency.js'


const cartButton  = document.querySelector('[data-cart-button]')
const cartWrapper  = document.querySelector('[data-cart-items-wrapper]')
const cartItemTemplate = document.querySelector('#cart-item-template')
const cartItemContainer = document.querySelector('[data-cart-items-container]')
const cartQuantity = document.querySelector('[data-cart-quantity]')
const cartTotal = document.querySelector('[data-cart-total]')
const cart = document.querySelector('[data-cart]')
let shoppingCart = []
const IMAGE_URL = "https://dummyimage.com/210x130"

const SESSION_STORAGE_KEY = 'SHOPPING_CART-cart'

export default function setUpShoppingCart(){
    addGlobalEventListner('click','[data-remove-from-cart-button]',e=>{
        const id =parseInt(e.target.closest('[data-item]').dataset.itemId) 
        removeFromCart(parseInt(id));
    })
    shoppingCart = loadCart()
    renderCart()

    cartButton.addEventListener('click',()=>{
        cartWrapper.classList.toggle('invisible')
    })
}

 function removeFromCart(id){
    const existingItem = shoppingCart.find(entry=> entry.id==id)
    if(existingItem == null){
        return
    }
    shoppingCart = shoppingCart.filter(entry=> entry.id!==id)
    renderCart()
    saveCart()
    //console.log(shoppingCart);
}



export  function addToCart(id){
    const existingItem = shoppingCart.find(entry=> entry.id==id)
    if(existingItem){
        existingItem.quantity++
    }else{
        shoppingCart.push({id:id,quantity:1})
    }
    renderCart()
    saveCart()
    //console.log(shoppingCart);
}

function renderCart(){
    if(shoppingCart.length===0){
        hideCart()
    }else if(shoppingCart.lastIndexOf>=1){
        renderCartItems()
    }
    else{
        showCart()
        renderCartItems()
    }
}

function saveCart(){
    sessionStorage.setItem(SESSION_STORAGE_KEY,JSON.stringify(shoppingCart))
}

function loadCart(){
    const c = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return JSON.parse(c) || []
}

function hideCart(){
    cart.classList.add('invisible')
    cartWrapper.classList.add('invisible')
}

function showCart(){
    cart.classList.remove('invisible')
}


function renderCartItems(){
    cartQuantity.innerHTML = shoppingCart.length
    
    const totalCents = shoppingCart.reduce((sum,entry)=>{
        const item = items.find(i => entry.id === i.id)
        return sum + item.priceCents*entry.quantity
    },0)
    cartTotal.innerHTML=  formatCurrency(totalCents/100)
    cartItemContainer.innerHTML=""
    
    shoppingCart.forEach(entry=>{

        const item = items.find(i => entry.id === i.id)
        const cartItem = cartItemTemplate.content.cloneNode(true)
        const container = cartItem.querySelector('[data-item]')

        container.dataset.itemId = item.id

        const name = cartItem.querySelector('[data-name]')
        name.innerText = item.name

        const quantity = cartItem.querySelector('[data-quantity]')
        quantity.innerText = `x${entry.quantity}`

        const image = cartItem.querySelector('[data-image]')
        image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

        const price = cartItem.querySelector('[data-price]')
        
        price.innerText = formatCurrency(item.priceCents*entry.quantity/100)
        cartItemContainer.appendChild(cartItem )
    })
    
}