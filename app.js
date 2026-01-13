let allMatches = [
    {"date":"2025-08-15","opponent":"AFC Bournemouth","goalsFor":4,"goalsAgainst":2},
    {"date":"2025-08-23","opponent":"Newcastle United","goalsFor":3,"goalsAgainst":2},
    {"date":"2025-08-30","opponent":"Arsenal","goalsFor":1,"goalsAgainst":0},
    {"date":"2025-09-13","opponent":"Burnley","goalsFor":1,"goalsAgainst":0},
    {"date":"2025-09-20","opponent":"Everton","goalsFor":2,"goalsAgainst":1},
    {"date":"2025-09-27","opponent":"Crystal Palace","goalsFor":1,"goalsAgainst":2},
    {"date":"2025-10-04","opponent":"Chelsea","goalsFor":1,"goalsAgainst":2},
    {"date":"2025-10-18","opponent":"Manchester United","goalsFor":1,"goalsAgainst":2},
    {"date":"2025-10-25","opponent":"Brentford","goalsFor":2,"goalsAgainst":3},
    {"date":"2025-11-01","opponent":"Aston Villa","goalsFor":2,"goalsAgainst":0},
    {"date":"2025-11-08","opponent":"Manchester City","goalsFor":0,"goalsAgainst":3},
    {"date":"2025-11-22","opponent":"Nottingham Forest","goalsFor":0,"goalsAgainst":3},
    {"date":"2025-11-30","opponent":"West Ham United","goalsFor":2,"goalsAgainst":0},
    {"date":"2025-12-03","opponent":"Sunderland","goalsFor":1,"goalsAgainst":1},
    {"date":"2025-12-06","opponent":"Leeds United","goalsFor":3,"goalsAgainst":3},
    {"date":"2025-12-13","opponent":"Brighton & Hove Albion","goalsFor":2,"goalsAgainst":0},
    {"date":"2025-12-20","opponent":"Tottenham Hotspur","goalsFor":2,"goalsAgainst":1},
    {"date":"2025-12-27","opponent":"Wolverhampton Wanderers","goalsFor":2,"goalsAgainst":1},
    {"date":"2026-01-01","opponent":"Leeds United","goalsFor":0,"goalsAgainst":0},
    {"date":"2026-01-04","opponent":"Fulham","goalsFor":2,"goalsAgainst":2},
    {"date":"2026-01-08","opponent":"Arsenal","goalsFor":0,"goalsAgainst":0}
];

allMatches = allMatches.map(m => {
    let result = m.goalsFor > m.goalsAgainst ? "W" :
                 m.goalsFor < m.goalsAgainst ? "L" : "D";
    return {...m, result};
});

let currentMatches = [...allMatches];
let sortOrder = {};

renderTable(currentMatches);
updateStats(currentMatches);
addSortListeners();
addFilterListener();

function renderTable(matches) {
    const tbody = document.getElementById('matches-table');
    tbody.innerHTML = '';
    matches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${match.date}</td>
            <td>${match.opponent}</td>
            <td>${match.goalsFor} : ${match.goalsAgainst}</td>
            <td>${match.goalsFor}</td>
            <td>${match.goalsAgainst}</td>
            <td class="${match.result}">${match.result}</td>
        `;
        tbody.appendChild(row);
    });
    updateStats(matches);
}

function updateStats(matches) {
    const total = matches.length;
    const wins = matches.filter(m => m.result==="W").length;
    const draws = matches.filter(m => m.result==="D").length;
    const losses = matches.filter(m => m.result==="L").length;
    const goalsFor = matches.reduce((s,m)=>s+m.goalsFor,0);
    const goalsAgainst = matches.reduce((s,m)=>s+m.goalsAgainst,0);

    const panel = document.getElementById('stats-panel');
    panel.innerHTML = `
        <div>Rozegrane mecze<span>${total}</span></div>
        <div>Zwycięstwa<span>${wins}</span></div>
        <div>Remisy<span>${draws}</span></div>
        <div>Porażki<span>${losses}</span></div>
        <div>Gole strzelone<span>${goalsFor}</span></div>
        <div>Gole stracone<span>${goalsAgainst}</span></div>
        <div>Bilans goli<span>${goalsFor - goalsAgainst}</span></div>
    `;
}

function addSortListeners() {
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach(header=>{
        const key = header.dataset.sort;
        sortOrder[key] = true;
        header.addEventListener('click', ()=>{
            headers.forEach(h=>h.classList.remove('asc','desc'));
            currentMatches.sort((a,b)=>{
                let valA=a[key], valB=b[key];
                if(key==="score"){valA=`${a.goalsFor}:${a.goalsAgainst}`; valB=`${b.goalsFor}:${b.goalsAgainst}`;}
                if(key==="date"){valA=new Date(valA); valB=new Date(valB);}
                if(typeof valA==="string"){if(valA<valB) return sortOrder[key]? -1:1; if(valA>valB) return sortOrder[key]? 1:-1; return 0;}
                return sortOrder[key]? valA-valB: valB-valA;
            });
            header.classList.add(sortOrder[key]? "asc":"desc");
            sortOrder[key]=!sortOrder[key];
            renderTable(currentMatches);
        });
    });
}

function addFilterListener() {
    const filter = document.getElementById('filter-result');
    filter.addEventListener('change',(e)=>{
        const val = e.target.value;
        if(val==="all") currentMatches=[...allMatches];
        else currentMatches = allMatches.filter(m=> 
            (val==="win" && m.result==="W") ||
            (val==="draw" && m.result==="D") ||
            (val==="loss" && m.result==="L")
        );
        renderTable(currentMatches);
    });
}
