let textField = document.getElementById('text-field');

function htmlTemplate(item) {
  return `
  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

document.addEventListener('submit', e => {
  e.preventDefault();
  if (textField.value) {
    axios.post('/add-item', {text: textField.value}).then(response => {
      document.getElementById('item-list').insertAdjacentHTML('beforeend', htmlTemplate(response.data));
      textField.value = "";
      textField.focus();
    }).catch(() => {
      console.log("Please, try again later");
    });
  }
})

document.addEventListener('click', e => {
  if (e.target.classList.contains('edit-me')) {
    let userInput = prompt("Please enter the new value", e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
    if (userInput) {
      axios.post('/edit-item', {text: userInput, id: e.target.getAttribute('data-id')}).then(() => {
        e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
      }).catch(() => {
        console.log("Please, try again later")
      });
    }
  }
})

document.addEventListener('click', e => {
  if (e.target.classList.contains('delete-me')) {
    if (confirm("Are you sure you want to delete this item?")) {
      axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(() => {
        e.target.parentElement.parentElement.remove();
      }).catch(() => {
        console.log("Please, try again later")
      });
    }
  }
})