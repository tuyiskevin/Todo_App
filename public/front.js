let createField = document.querySelector('.form-control');

function itemTemplate(items) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${items.text}</span>
        <div>
          <button data-id="${items._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${items._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`;
}
//initial page rendering
let newHTML = dataBase.map(item=>itemTemplate(item)).join('');
document.getElementById("unordered").insertAdjacentHTML('beforeend', newHTML);

//adding an item to the list
document.querySelector('#formCreate').addEventListener('submit', (e)=>{
    e.preventDefault();
    axios.post('/submitted', {text: createField.value}).then((response)=>{
                document.getElementById('unordered').insertAdjacentHTML('afterbegin', itemTemplate(response.data));
                createField.value ="";
                createField.focus();


        }).catch(()=>{
            console.log("try again");
        });

});

document.addEventListener("click",(e)=>{

    //delete item
    if(e.target.classList.contains('delete-me')){
        if(confirm("Are you sure?")){
            axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(()=>{
            e.target.parentElement.parentElement.remove();
        }).catch(()=>{
            console.log("try again");
        });
        
        }
    }


    //update item
    if(e.target.classList.contains('edit-me')){

        let userInput = prompt('Edit item', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);

        let key_id = e.target.getAttribute('data-id');
        if(userInput){

            axios.post('/update-item', {text: userInput, id: key_id}).then(()=>{
            e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
        }).catch(()=>{
            console.log("try again");
        });

        }
    
    }
} );