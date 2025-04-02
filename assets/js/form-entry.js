var hp = document.getElementsByClassName("hp");
       for(let i = 0; i < hp.length; i++){
           hp[i].onclick = function (){
             if(this.parentElement.children[0].type == "password"){
              hp[i].classList.remove('fa-eye');
              hp[i].classList.add('fa-eye-slash');
              hp[i].parentElement.children[0].type = 'text';
                
             }else{
              hp[i].classList.add('fa-eye');
              hp[i].classList.remove('fa-eye-slash');
              hp[i].parentElement.children[0].type = 'password';
                
             }
           }
       }
       
       
 var form = document.getElementsByTagName("form");
for(i = 0; i < form.length; i++){
  form[i].onsubmit = async function(e){
   e.preventDefault();
   if(this.getAttribute("working")== "1"){
    return;
   }
   this.setAttribute("working","1");
    let formdata = new FormData(this);
    const data = {};
    formdata.forEach((v,k)=>{
      if(k.length > 0){
        data[k] = v;
      }
    });
    
    const req = await fetch(api+"/"+this.getAttribute("route"),{
      method:"POST",
      headers:{
        token:window.localStorage.getItem("token")
      },
      body:JSON.stringify(data)
    });
    const res = await req.json();
    this.setAttribute("working","0");
    if(!res.status){
      Swal.fire({
        icon: "error",
        text: res.message
      });
    }else{
      Swal.fire({
        icon: "success",
        text: res.message
      });
      if(res.hasOwnProperty("token")){
        window.localStorage.setItem('token',res.token);
      }
      setTimeout(()=>{
        if(this.getAttribute("redirect").length > 0)
        window.location.href = this.getAttribute("redirect");
      },2000);
    }
    
  }
}      