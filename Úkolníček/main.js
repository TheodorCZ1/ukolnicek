const add_button = document.querySelector("#add_button");
const delete_history = document.querySelector("#delete_history");
const job_name = document.querySelector("#job_name");
const not_done = document.querySelector("#not_done_counter");
const done = document.querySelector("#done_counter");
const ticker = document.querySelector(".ticker");
const job_list = document.querySelector(".job_list");

ticker.onclick = function() {
    let contains = ticker.parentElement.classList.contains("hotovo");
    if (contains) {
        ticker.parentElement.classList.remove("hotovo");
    
    } else {
        ticker.parentElement.classList.add("hotovo");
    }
    
}

load_counter();
load_jobs();

add_button.onclick = function() {
    if(job_name.value === "") {
        alert("Není možné přidat prázdný úkol")
    } else {
        create_new_job(job_name.value);
        change_not_done_counter(+1);    
    }
}

delete_history.onclick = function() {
    change_done_counter(0);
    change_not_done_counter(0);
}

function format(number) {
    if (number < 10) {
        number = "0" + number;
    }

    return number;
}

function counter_extract(done_counter, not_done_counter) {
    done.textContent = format(done_counter);
    not_done.textContent = format(not_done_counter);

    console.log(done_counter);
    console.log(not_done_counter);

}

function load_counter() {
    let done = localStorage.getItem("done");
    let not_done = localStorage.getItem("not_done");
    if (done == null) {
        done = 0;
    }if (not_done == null) {
        not_done = 0;
    }
    counter_extract(done, not_done)
}

function save_counter() {
    let done_amount = parseInt(done.textContent);
    let not_done_amount = parseInt(not_done.textContent);

    localStorage.setItem("done", done_amount);
    localStorage.setItem("not_done", not_done_amount);
}

function create_new_job(job_text, done_job) {
    let job = job_list.querySelector(".model-job").cloneNode(true);
    job.classList.remove("model-job");
    job.querySelector("p").innerText = job_text;

    if (done_job) {
        job.classList.add("done_job");
    }
    job.querySelector(".ticker").onclick = function(udalost) {
        let zaskrtavatko = udalost.target;
    
        let obsahuje = zaskrtavatko.parentElement.classList.contains("done_job");
        
        if (obsahuje) {
            zaskrtavatko.parentElement.classList.remove("done_job");
            change_done_counter(-1);
        } else {
            zaskrtavatko.parentElement.classList.add("done_job");
            change_done_counter(+1);
        }
        save_job();
    }
    
    job.querySelector(".delete").onclick = function(udalost) {
        let popelnice = udalost.target;
    
        popelnice.parentElement.parentElement.remove();
        save_job();
    }

    job_list.appendChild(job);
    save_job();
}

function save_job() {
    let jobs = job_list.querySelectorAll(".job");
    let jobs_to_save = [];
    for (let job of jobs) {
        if (job.classList.contains("model-job")) {
            continue;
        }
        let job_text = job.querySelector("p").textContent;
        let done_job = job.classList.contains("done_job");
        jobs_to_save.push([job_text, done_job]);
    }

    localStorage.setItem("job_list", JSON.stringify(jobs_to_save));
    console.log(jobs_to_save); //ODSTRANIT
}

function load_jobs() {
    let job_list = localStorage.getItem("job_list");
    if (job_list == null) {
        return;
    }
    job_list = JSON.parse(job_list);

    for (let job of job_list) {
        let job_text = job[0];
        let done_job = job [1];

        create_new_job(job_text, done_job);

    }
}

function change_done_counter(plusminus) {
    let done_jobs = parseInt(done.textContent);
    
    if (plusminus < 0) {
        done_jobs = done_jobs - 1;
    } else {
        done_jobs = done_jobs + 1;
    }

    done.textContent = format(done_jobs);
    save_counter();
}

function change_not_done_counter(plusminus) {
    let not_done_jobs = parseInt(not_done.textContent);
    
    if (plusminus < 0) {
        not_done_jobs = not_done_jobs - 1;
    } else {
        not_done_jobs = not_done_jobs + 1;
    }

    not_done.textContent = format(not_done_jobs);
    save_counter();
}
