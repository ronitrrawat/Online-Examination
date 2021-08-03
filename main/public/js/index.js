//  const loginForm=document.querySelector('#register-form')

//  loginForm.addEventListener('submit',(e)=>{
// })



// const Email=document.querySelector('#emailID')
// const Password=document.querySelector('#pass')
// loginForm.addEventListener('submit',(e)=>{
//     e.preventDefault()
//     const email=Email.value
//     const password=Password.value
//     fetch('/loginUser?email='+email+'&password='+password).then((response)=>{
//         response.json().then((data)=>{
//             const message=data.message
//             alert(message)
//             //location.href=`/profile?&token=${data.token}`
//         })
//     })

// })


// JQUERY

$(document).ready(function() {
    $("#formButton1").click(function() {
      $("#contain2").toggle();
      $("#contain1").hide();
    });
  });