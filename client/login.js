let baseUrl = 'http://localhost:3000'

$('#main-content').hide()
$('#button-log').click(function () {
  event.preventDefault();
  isGuest()
})

if (localStorage.getItem('token')) {
  isLogin()
}

function isGuest() {
  $('#main-content').hide()
}

function isLogin() {
  $.ajax({
    method: 'get',
    url: baseUrl + '/users/verified',
    headers: { token: localStorage.getItem('token') }
  })
    .done(response => {
      fetchData()
      $('#main-content').show()
      $('#button-log').hide()
      $('#update-todo').hide()
    })
    .fail((jqXHR, textStatus) => {
      localStorage.clear();
    })
}

$('#register_submit').click(function () {
  event.preventDefault();
  $.ajax({
    method: 'POST',
    url: baseUrl + '/users/register',
    data: {
      email: $('#register_email').val(),
      password: $('#register_password').val()
    }
  })
    .done(response => {
      Swal.fire(
        'You are registered, Please Sign In'
      )
      isGuest()
    })
    .fail((jqXHR, textStatus) => {
      let error = jqXHR.responseJSON.errors.email.message
      Swal.fire(
        'Request Failed', error
      )
    })
})

$('#login_submit').click(function () {
  event.preventDefault();
  $.ajax({
    method: 'POST',
    url: baseUrl + '/users/login',
    data: {
      email: $('#login_email').val(),
      password: $('#login_password').val()
    }
  })
    .done(response => {
      localStorage.setItem('token', response.access_token)
      $('#login_email').val('')
      $('#login_password').val('')
      swal.fire("Welcome", "Login Succes", "success")
      isLogin()
      $('#modalLRForm').modal('toggle')
    })
    .fail((jqXHR, textStatus) => {
      console.log('request failed', textStatus)
    })
})

$('#submit-todo').click(function () {
  event.preventDefault();
  $('#col-todo').html('')

  event.preventDefault();
  $.ajax({
    method: 'POST',
    url: baseUrl + '/todos',
    data: {
      name: $('#name').val(),
      description: $('#description').val(),
      due_date: $('#date').val(),
    },
    headers: { token: localStorage.getItem('token') }
  })
    .done(response => {
      // console.log(response)
      $('#name').val('')
      $('#description').val('')
      $('#date').val('')
      fetchData()
    })
    .fail((jqXHR, textStatus) => {
      console.log('cant create todo, textStatus')
    })
})

function fetchData() {
  $.ajax({
    method: 'GET',
    url: baseUrl + '/todos',
    headers: { token: localStorage.getItem('token') }
  })
    .done(response => {
      // console.log(response)
      response.forEach((el) => {

        $('#col-todo').append(`
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <ul class="list-group">
                  <li class="list-group-item ">
                    ${el.name}
                  </li>
                  <li class="list-group-item ">
                    ${el.description}
                  </li>
                  <li class="list-group-item ">
                    ${el.status}
                  </li>
                  <li class="list-group-item ">
                    ${el.due_date}
                  </li>
                  <button type="submit" class="btn btn-primary mt-4 pr-4 pl-4 todo" id="update-todo" onclick = "updateTodo('${el._id}')" >Update</button>
                  <button type="submit" class="btn btn-primary mt-4 pr-4 pl-4" id="delete-todo" onclick = "deleteTodo('${el._id}')">Delete</button>
                </ul>
              </div>
            </div>
          </div>`)

      });
    })
    .fail((jqXHR, textStatus) => {
      console.log('Not Found', textStatus)
    })
}

function deleteTodo(value_id) {
  event.preventDefault()
  // console.log(value_id)
  $('#col-todo').html('')

  $.ajax({
    method: 'DELETE',
    url: baseUrl + `/todos/${value_id}`,
    headers: { token: localStorage.getItem('token') }
  })
    .done(response => {
      console.log(response)
      fetchData()
    })
    .fail((jqXhr, textStatus) => {
      console.log('erro delete', textStatus)
    })
}

function updateTodo(value) {
  // console.log(value)
  $('#input-todo').hide()
  $('#update-todo').show()
  $.ajax({
    method: 'GET',
    url: baseUrl + `/todos/${value}`,
    headers: { token: localStorage.getItem('token') }
  })
    .done(response => {
      // console.log(response)
      $('#todo_id_update').val(response._id)
      $('#update-name').val(response.name)
      $('#update-description').val(response.description)
      $('#update-status').val(response.status)
      $('#update-date').val(response.due_date.substring(0, 10))

    })
    .fail((jqXHR, textStatus) => {
      console.log('err', textStatus)
    })
}

$('#update-todo-submit').click(function () {
  $('#col-todo').html('')
  // console.log($('#todo_id_update'));

  event.preventDefault();
  $.ajax({
    method: 'PUT',
    url: baseUrl + `/todos/${$('#todo_id_update').val()}`,
    data: {
      name: $('#update-name').val(),
      description: $('#update-description').val(),
      status: $('#update-status').val(),
      due_date: $('#update-date').val(),
    },
    headers: { token: localStorage.getItem('token') }
  })
    .done(response => {
      $('#update-name').val('')
      $('#update-description').val('')
      $('#update-status').val('')
      $('#update-date').val('')
      fetchData()
    })
    .fail((jqXHR, textStatus) => {
      console.log('cant create todo, textStatus')
    })
})

function signOut() {
  event.preventDefault()
  localStorage.removeItem('token')
  $('#main-content').hide()
  $('#button-log').show()
  // var auth2 = gapi.auth2.getAuthInstance();
  // auth2.signOut().then(function () {
  //   swal.fire("Success", "User signed out.", "success");
  // });

}

function onSignIn(googleUser) {
  postLogin()
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token

  $.ajax({
    url: baseUrl + '/users/login',
    method: 'POST',
    data: { idToken: id_token }
  })
    .done((response) => {
      localStorage.setItem('token', response.token)
    })
    .fail((jqXHR, textStatus) => {
      console.log('request failed', textStatus)
    })
}
