        function tempId(){
            return "temp"+Math.random().toString().split(".")[1];
        }
        
       function list(d,m=''){
           
           for(let i = 0; i < d?.length ; i++){
               let data = d[i];
               let ur = `<span id="c-${data.list_id}"><i>${data.unread_messages_count}</i></span>`;
    let    list = `<a class="pc-lister" id="list-${data.list_id}" href="javascript:void(0)" onclick="cb_show(this)" data-id="${data.list_id}"><div class="avi" style="background-image:url('https://lin.com.ng/mailin/media/${data.avi}');background-size:cover;background-position:center"></div>
                        <div class="details">
                      <div class="top"><h2>${data.fullname}</h2> <small>${data.last_message_date}</small></div>
                      <div class="bottom"><p id="lm-${data.list_id}">${data.last_message}</p>
               ${(data.unread_messages_count > 0)?ur:''}
                      </div>
                        </div></a>`;
               
             let cboard = `<div class="chat-board" id="${data.list_id}">
              <div class="cb-header">
                  <button class="close-chat-board" onclick="close_cboard(this)" data-id="${data.list_id}">Back</button>
                  <div class="cb-avi" style="background-image:url('https://lin.com.ng/mailin/media/${data.avi}');background-size:cover;background-position:center"></div>
                  <h3>${data.fullname}</h3> 
              </div>
              
             <div class="messsges" id="chat-${data.list_id}" onscroll="cb_scroll(this)">
                 ${loadchat(data.init_messages)}
             </div>
             <form class="input" onsubmit="send_chat(this,event)" data-id="${data.list_id}">
                  <input name="message" placeholder="Start typing..." type="text" autocomplete="off">
                  <input name="pid" type="hidden" value="${data.user_id}">
                  <button>Send</button>
             </form>
          </div> 
          `;
         if(m == 'a'){
             document.getElementById("peep-chat-list").innerHTML = list + document.getElementById("peep-chat-list").innerHTML;

             document.getElementById("app").innerHTML = cboard + document.getElementById("app").innerHTML;
         }else{
            document.getElementById("peep-chat-list").innerHTML =   document.getElementById("peep-chat-list").innerHTML + list;

             document.getElementById("app").innerHTML =   document.getElementById("app").innerHTML + cboard;
         }
   
           }
           
       }   
       
       function send_chat(el,e){
           e.preventDefault();
          const fd = new FormData(el),data = {};
          const id = tempId();
          const text = el.children[0].value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
         let msg = msgCard({
           "message": text,
           "id":id,
           "rr":"Sending..."
         });
          el.children[0].value = "";
    document.getElementById("chat-"+el.getAttribute("data-id")).innerHTML = document.getElementById("chat-"+el.getAttribute("data-id")).innerHTML + msg;
    document.getElementById("chat-"+el.getAttribute("data-id")).scrollTop = document.getElementById("chat-"+el.getAttribute("data-id")).scrollHeight;
    
          fd.forEach((item, key)=>{
              data[key]=item;
          });
        
           uiR("https://lin.com.ng/mailin/send_message",'POST',data).then((a)=>{
              
        document.getElementById(id).setAttribute("data-mid",a.data.mid);
        document.getElementById('lm-'+ a.data.list_id).innerText = a.data.last_message;
      document.getElementById(id).children[2].children[0].innerText = `${a.data.date} . ${a.data.time}`;
    document.getElementById(id).children[2].children[1].innerText = "sent";
    
           });
       }

      function loadchat(d){
           let rt = 0;
           let messages = '';
           for(let i = 0; i < d?.length ; i++){
               let data = d[i];
            let rr = "";
            
            if(data.side == "")rr = data.seen;
          if(data.side !== "center"){
              messages += `<div class="msg-card ${data.side}" data-seen="${data.seen}" data-mid="${data.mid}" data-lid="${data.list_id}">
                     <p>${data.message}</p>
            <div class="clear"></div>
                    <span>
                     <small>${data.date} &#46 ${data.time}</small>
                     <small>${rr}</small>
                         
                     </span>
                 </div>`;
          }else{
              let msg = (data.message.length > 0)?"<div class='center-msg'>"+data.message+"</div>":'';
             messages += `<div id="center-${data.list_id}">${msg}</div>`;
          }
              
                      
           }
           return messages;
           
       }    
       
       function msgCard(data){
           return `<div class="msg-card ${data?.side}" data-seen="${data?.seen}" data-mid="${data?.mid}" data-lid="${data?.list_id}" id="${data?.id}">
                     <p>${data?.message}</p>
            <div class="clear"></div>
                    <span>
                     <small id="time-${data?.id}">${(data?.date)?data?.date:""} &#46 ${(data?.time)?data?.time:""}</small>
                     <small id="rr-${data?.id}">${data?.rr}</small>
                         
                     </span>
                 </div>`;
       }
       
        const fh = window.innerHeight;
        const fw = window.innerWidth;
           window.onresize = function(){
               document.body.style.width = `${fw}px`;
               document.body.style.height = `${fh}px`;
           }
            window.onload =  function () {

       const b = uiR("https://lin.com.ng/mailin/list/1",'GET');
       b.then((a)=>{
      
            if(a?.data.length > 0){
                list(a?.data); 
                localStorage.setItem("opened-chat","");
                localStorage.setItem('list-size', a?.unread);
                localStorage.setItem('list-at', new Date().getTime());
            }
 
       });
       
         
            }
       
       
       async function uiR(url,method,body){
            var req; 
                try{
  if(method.toLowerCase() == "get"){
         req = await fetch(url,{
                method:method,
                headers:{
                    "Content-Type":"application/json",
                    "token": localStorage.getItem("token")
                }
             });
                    }else{
        req = await fetch(url,{
                method:method,
                headers:{
                    "Content-Type":"application/json",
                    "token": localStorage.getItem("token")
                },
                body:JSON.stringify(body)
             });
                    }
    
            return await req.json();
                }catch(e){
              //action if error on request
                }
            }
            var pp = document.getElementsByClassName("peeps"), avis= document.getElementsByClassName("avi"),pl= document.getElementsByClassName("pc-lister"),cbavi = document.getElementsByClassName("cb-avi"),ccb = document.getElementsByClassName("close-chat-board");
            
            for(let i of pp){
                i.style.background = `url(${i.getAttribute("data-src")})`;
                i.style.backgroundSize = "cover";
                    i.style.backgroundPosition = "center";
            }
           
            for(let i of avis){
                i.style.background = `url(${i.getAttribute("data-src")})`;
                i.style.backgroundSize = "cover";
                    i.style.backgroundPosition = "center";
            }
            for(let i of cbavi){
                i.style.background = `url(${i.getAttribute("data-src")})`;
                i.style.backgroundSize = "cover";
                    i.style.backgroundPosition = "center";
            }
    const clean_last_msg = (d,)=>{
      if(d.children[d.children.length - 1].id.includes("center-")){
          return 
      }
    }      
    var eu = false,ed = false;      
    function cb_scroll(d){

      if(d.scrollTop < (d.clientHeight * 0.3)){
  
 
    if(eu == true)return;  
    eu = true;

    let a = d.children;
       let e = "";
       for(let i = 0; i < a.length;i++){
          if(!a[i].id.toString().includes("center-") && e == ""){
               e = a[i];
              
          } 
       }
       
   uiR("https://lin.com.ng/mailin/messages/up","POST",{
       "key":e.getAttribute("data-mid"),
       "list_id":e.getAttribute("data-lid")
   }).then(data=>{
       if(data.status == 1){
           let msgs = loadchat(data.data);
           d.innerHTML = msgs + d.innerHTML;
            eu = false;
          
       }
   });
    
      }
      


            } 
            
            function cb_show(d){
                   
                for(let a of document.getElementsByClassName("chat-board")){
        a.style.display = "none";
        
                }
                
              
           
                document.getElementById(d.getAttribute("data-id")).style.display = "block";
                document.getElementById("center-"+d.getAttribute("data-id")).scrollIntoView();   
                document.getElementById(d.getAttribute("data-id")).style.animation = "cbi 0.5s forwards";
                document.getElementById("peep-chat-list").style.animation = "ls 0.4s forwards";
                localStorage.setItem("opened-chat",d.getAttribute("data-id"));
                
     
            
   if(document.getElementById('center-'+d.getAttribute("data-id")) && document.getElementById('center-'+d.getAttribute("data-id")).innerText.length > 0){
                         
     uiR("https://lin.com.ng/mailin/seen",'POST',{
           "lid":d.getAttribute("data-id")
       }).then((b)=>{
            if(document.getElementById(`c-${d.getAttribute("data-id")}`)){
             document.getElementById(`c-${d.getAttribute("data-id")}`).innerHTML = '';
            }
    
       });
     
            }      
        
        
                
                }
       
       
            
            function close_cboard(i){
                 
                   i.parentElement.parentElement.style.animation = "cbo 0.5s forwards"
                   document.getElementById("peep-chat-list").style.animation = "lso 0.4s forwards";
                 localStorage.setItem("opened-chat","");
                   if(document.getElementById(`center-${i.getAttribute("data-id")}`)){
                document.getElementById(`center-${i.getAttribute("data-id")}`).innerHTML = ''; 
                }
                
                
               } 
         function listen(){
              
             if(localStorage.getItem("opened-chat") == null || localStorage.getItem("opened-chat") == ""){
                 
                     uiR("https://lin.com.ng/mailin/live-messages", "POST", {
                         "listSize": localStorage.getItem('list-size'),
                         "listAt": localStorage.getItem('list-at')
                     }).then(res=>{
                     
                         var pc = document.getElementsByClassName('pc-lister');
                       
                         if (res && res.status && res.data.length > 0) {
                            console.log(res);
                             for (let i = 0; i < res.data.length; i++) {
                                document.getElementById(res.data[i].list_id).remove();
                                 document.getElementById('list-'+ res.data[i].list_id).remove();
                              
                             }

                         
                              
                             list(res.data,'a');
                             localStorage.setItem('list-at', new Date().getTime());
                             let newD = res.data.length - 1;
                             localStorage.setItem('list-size', parseInt(localStorage.getItem('list-size')) + newD);
                            
                         }
                       
                         listen();
 
                     }).catch((er)=>{
                         console.log(er);
                     });
                   
            }else{
                let opened = localStorage.getItem("opened-chat");
               uiR("https://lin.com.ng/mailin/new-messages","POST",{
                    "cid":opened
                }).then(data=>{
                    if(data.status == 1){
               let msgs = loadchat(data.data);
               let d = document.getElementById("chat-"+opened);
                  if(document.getElementById(`center-${opened}`)){
                document.getElementById(`center-${opened}`).innerHTML = ''; 
                }
                
           d.innerHTML =  d.innerHTML  + msgs;        
  ;
            if(d.scrollHeight - (d.scrollTop + d.clientHeight) < ((d.scrollTop + d.clientHeight) * 0.095)){
     d.scrollTop = d.scrollHeight;
 }
                    }
           listen();
                }); 
                
                
            }
         }
         
         listen();