const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const getPrayer = async (position) => {
    try {
        let long,
            d = new Date(),
            lat,
            city,
            prayer;

        const cityElemeny = document.querySelector('.city'),
            container = document.querySelector('.location-container'),
            listPrayer = document.querySelector('.prayer-list');

        long = position.coords.longitude;
        lat = position.coords.latitude;

        const [respTodoOne, respTodoTwo] = await Promise.all([
            fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long} &apiKey=64ff5742184c40e69b04e0312190ff01`),
            fetch(`http://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=2`)
        ]);

        const [cityData, prayerData] = await Promise.all([respTodoOne.json(), respTodoTwo.json()]);
        console.log(prayerData)
        let time = document.createElement('h3');
        time.textContent = d.toLocaleTimeString();
        time.classList.add('new-li','timezone');
        container.appendChild(time)

        setInterval(()=>{
            let d = new Date();
            time.textContent = d.toLocaleTimeString();
        },1000)

        city = cityData['features'][0]['properties']['city'];
        prayer = prayerData.data[d.getDate()].timings;
        cityElemeny.textContent = city;
        for(let key in prayer){
            const li = document.createElement("li");
            const span = document.createElement("span");
            li.classList.add('prayer-time','new-li');
            span.classList.add('pray')
            li.textContent = key;
            span.textContent = prayer[key];
            li.appendChild(span);
            listPrayer.appendChild(li);
            await sleep(20)
        }

    } catch (err) {
        throw err;
    }
};
navigator.geolocation.getCurrentPosition(getPrayer);

