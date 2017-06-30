
moment().format();
var audio = document.getElementById('myAlarm');
const date = document.getElementById('trainDate')
const numeroTreno = document.getElementById('trainNumber');
const button = document.getElementById('submit');
const station = document.getElementById('startStation');
const listContainer = document.getElementById('list-container');
var stationId;
var selectedDate;
var trainsArray;
var effectiveDate;
var preferredStation;

   function playAudio() {
        audio.play();
    }

    function stopAudio() {
        audio.pause();
    }

if (localStorage.getItem('station')) {
    selectedDate = moment().toDate();
    selectedStation = localStorage.getItem('station');
    getIdStation(selectedStation);
}

//estrae l'ID della stazione dal campo di testo
function getIdStation(station) {
    let url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaStazione/${station}`;
    const promise = fetch(url)
        .then((response) => {
            return response.json()
        }).then((response) => {
            stationId = response[0].id;
            trainsList(stationId, selectedDate)
        })
}

//estrae le partenze da una determinata stazione ad un orario prestabilito
function trainsList(stationId, selectedDate) {
    let url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/partenze/${stationId}/${selectedDate}`;
    const promise = fetch(url)
        .then((response) => {
            return response.json()
        }).then((response) => {
            trainsArray = response;
            calculatePrintDelay(trainsArray);
        })
}

//click del bottone cerca
button.addEventListener('click', (e) => {
    listContainer.innerHTML = '';
    localStorage.setItem('station', station.value.toUpperCase());
    const selectedStation = station.value.toUpperCase();
    selectedDate = moment(date.value).toDate();
    console.log(selectedDate);
    getIdStation(selectedStation)
})

function calculatePrintDelay(trainsArray) {
    trainsArray.forEach((train) => {
        var timeBefore = document.getElementById('timeBefore');
        timeBefore = parseInt(timeBefore.value);
        var effectiveDate = moment(train.orarioPartenza).subtract(parseInt(timeBefore), 'minutes').add(train.ritardo, 'minutes');
        //genera l'html di ogni treno
        trainList = document.createElement("div");
        listContainer.appendChild(trainList);
        trainList.innerHTML =
            `<div class="col s12 m4">
                <div class="card  blue-grey lighten-3">
                    <div class="card-content">
                        <div class="singleTrainLi">
                        <span class="card-title">${train.destinazione}</span>
                    <h5>${train.compOrarioPartenzaZero}</h5>
                    <h6>ritardo: <span id="ritardo">${train.ritardo}</span> min</h6>
                    <p id="frase">per arrivare ${timeBefore} minuti prima, ti dovrai svegliare alle ${moment(effectiveDate._d).format('LT')}</p>
                    <div class="card-action">
                    <button onclick="setAlarm('${train.codOrigine}', ${train.numeroTreno}, ${train.orarioPartenza}, ${timeBefore})" class="listButton btn">svegliami</button>
                    </div>
                    </div>
                    </div>
            </div> 
            </div>`
    })
}

function setAlarm(originStation, trainNumber, partenza, timeBefore) {
    listContainer.innerHTML = '';
    updatingDelay();
    setInterval(() => {
        updatingDelay(originStation, trainNumber);
    }, 10000)
}

    function updatingDelay() {
        let url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${originStation}/${trainNumber}`;
        const promise = fetch(url)
            .then((response) => {
                return response.json()
            }).then((response) => {
                var now = new Date().valueOf();
                var wakeUp = moment(partenza).subtract(timeBefore, 'minutes').add(response.ritardo, 'minutes');
                countDown(wakeUp);
                onBoard(response);
            })
    }

function onBoard(response) {
    var onBoardButton = document.getElementById('onBoard');
    var destination = document.getElementById('destination');
    var container = document.getElementById('countdownContainer').style.display = 'flex';
    onBoardButton.style.display = 'inline';
    onBoardButton.addEventListener('click', () => {
        var destinationStation = destination.value.toUpperCase();
        response.fermate.forEach(function (item, i) {
            if (item.stazione == destinationStation) {
                var previousDestination = response.fermate[i - 1];
                var testo = document.getElementById('onboarding');
                testo.innerHTML = `<h5>Verrai svegliato alla stazione di ${previousDestination.stazione}</h5`
                if (previousDestination.stazione == response.stazioneUltimoRilevamento) {
                    testo.innerHTML = `<h5>Hai superato ${previousDestination.stazione}, la prossima stazione è ${destinationStation}`
                    var audio = new Audio('Old-alarm-clock-ringing.mp3');
                    playAudio();
                }
            }
        })
    })
}