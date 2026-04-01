
document.addEventListener('DOMContentLoaded', () => {
    // ১. ক্লক লজিক (Clock Logic)
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const clockEl = document.getElementById('digital-clock');
        const dateEl = document.getElementById('date-info');
        
        if (clockEl) clockEl.innerText = `${hours}:${minutes}`;
        if (dateEl) {
            dateEl.innerText = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ২. ওয়েদার এবং লোকেশন লজিক (Weather & Location Logic)
    async function initSystemData() {
        const tempEl = document.getElementById('temp-display');
        const locEl = document.getElementById('loc-info');
        const weatherDesc = document.getElementById('weather-desc');

        try {
            // IP ভিত্তিক লোকেশন
            const locRes = await fetch('https://ipapi.co/json/');
            const locData = await locRes.json();
            
            if (locEl) locEl.innerText = locData.city.toUpperCase();
            if (weatherDesc) weatherDesc.innerText = locData.city.toUpperCase();

            // ওয়েদার ডেটা ফেচিং
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locData.latitude}&longitude=${locData.longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();
            const temp = Math.round(weatherData.current_weather.temperature);

            if (tempEl) tempEl.innerText = `${temp}°C`;
            addToTerminal(`System sync complete. Welcome to ${locData.city}.`, "text-pink-400");
        } catch (error) {
            console.error("Sync Error:", error);
            if (tempEl) tempEl.innerText = "N/A";
            if (locEl) locEl.innerText = "OFFLINE";
        }
    }
    initSystemData();

    // ৩. টার্মিনাল লগ আপডেট
    function addToTerminal(msg, colorClass = "text-cyan-300/70") {
        const logBox = document.getElementById('terminal-box');
        if (logBox) {
            const p = document.createElement('p');
            p.className = `mb-1 ${colorClass}`;
            p.innerHTML = `> ${msg}`;
            logBox.appendChild(p);
            logBox.scrollTop = logBox.scrollHeight;
        }
    }

    // ৪. ব্রাউজার শর্টকাট লজিক
    window.openApp = (url) => {
        addToTerminal(`Launching application: ${url.split('.')[0]}...`, "text-white");
        window.open(`https://${url}`, '_blank');
    };
});