var audio = document.getElementById('myAlarm');

    function playAudio() {
        audio.play();
    }

    function stopAudio() {
        audio.pause();
    }

function countDown(wakeUp) {
// Set the date we're counting down to
var countDownDate = new Date(wakeUp).getTime();
console.log(countDownDate);
// Update the count down every 1 second
var x = setInterval(function(audio) {

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = `
    <div><h3 id="countDownTitle">Per prendere il treno in orario, ti sveglierai tra:</h3></div><br />
        <div class="row" id="ciaone">
            <div class="col s12">
                    <div class="text-center">
                        <ul class="countdown">
                            <li><span>${days} </span><p>giorni</p></li> 
                            <li><span>${hours} </span><p>ore</p></li>
                            <li><span>${minutes} </span><p>minuti</p></li>
                            <li><span>${seconds} </span><p>secondi</p></li>
                        </ul>    
                    </div>
            </div>
        </div>
    `

    // If the count down is over, write some text 
    if (distance <= 0) {
        playAudio();
        clearInterval(x);
        document.getElementById("demo").innerHTML = 
        "<h3>È già ora di alzarsi!<h3><button class='btn waves-effect waves-light' onClick='stopAudio()'>stop</button>"
    }
}, 1000);
}


