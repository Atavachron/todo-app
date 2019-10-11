document.addEventListener('click', e => {
  if (e.target.classList.contains('edit-me')) {
    let userInput = prompt("Please enter the new value");
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