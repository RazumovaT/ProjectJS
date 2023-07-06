const input = document.querySelector(".input");
const userList = document.querySelector(".user-list");
const choosenRepositories = document.querySelector(".choosen-repositories");

class Api {
  constructor() {
    this.BASE_URL = "https://api.github.com";
  }

  async getReposByQuery(query) {
    try {
      const res = await fetch(
        `${this.BASE_URL}/search/repositories?q=${query}`
      );
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  }
}

const api = new Api();

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

const handleInput = (e) => {
  if (!e.target.value) {
    clear();
    return;
  }
  api
    .getReposByQuery(e.target.value)
    .then((data) => renderRepos(data.items.slice(0, 5)));
};

const debouncedHandleInput = debounce(handleInput, 500);

input.addEventListener("input", debouncedHandleInput);

function clear() {
  userList.textContent = "";
}

function renderRepos(repos) {
  clear();
  repos.forEach((rep) => {
    userList.insertAdjacentHTML(
      "afterbegin",
      `<li class="user-repo">${rep.name}</li>`
    );
    document.querySelector("li").addEventListener("click", () => {
      choosenRepositories.insertAdjacentHTML(
        "afterbegin",
        `
                    <div class="rep">
                    <div class="rep-info">Name: ${rep.name}<br>
                    Owner: ${rep.owner.login}<br>
                    Stars: ${rep.stargazers_count}<br>
                    </div>
                    <button class="cancel-button"><svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4"/>
                            <path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4"/>
                                                                    </svg>
                                                                         </button>
                                                                                </div>`
      );
      document.querySelector("button").addEventListener("click", () => {
        document.querySelector(".rep").remove();
      });
    });
  });
}
