tailwind.config = {
  darkMode: "class",
};

// ------------- APIS ----------
async function fetchTodos() {
  const res = await fetch(
    "https://671f4fb0e7a5792f052dc74f.mockapi.io/todos",
  );
  const data = await res.json();
  return data;
}

async function createTodo(todo) {
  const res = await fetch(
    "https://671f4fb0e7a5792f052dc74f.mockapi.io/todos",
    {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await res.json();
  return data;
}

async function deleteTodo(todoId) {
  const res = await fetch(
    `https://671f4fb0e7a5792f052dc74f.mockapi.io/todos/${todoId}`,
    {
      method: "DELETE",
    },
  );
  const data = await res.json();
  return data;
}

async function toggleTodo(todoId, completed) {
  const res = await fetch(        
    `https://671f4fb0e7a5792f052dc74f.mockapi.io/todos/${todoId}`,
    {
      method: "PUT",
      body: JSON.stringify({
      completed: completed}),
      headers: {
        "Content-Type": "application/json",
      }
    }
  );
  const data = await res.json();
  return data;
}
// ------------- APIS ----------

const input = document.getElementById("input");
const list = document.getElementById("list");
const toggle = document.getElementById("toggle");
const footer = document.getElementById("footer");
const counter = document.getElementById("counter");
const clearCompleted = document.getElementById("clear-completed");
const toggleThemeEl = document.getElementById("toggle-theme");

const darkThemeIcon = `<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" class="fill-sky-400/20"></path><path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" class="fill-sky-500"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" class="fill-sky-500"></path></svg>`;
const lightThemeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" class="fill-sky-400/20 stroke-sky-500"></path><path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" class="stroke-sky-500"></path></svg>`;

let todos = [];

let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode")) || false;

function getCountLeft() {
  return todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0);
}

function createTodoItemEl({ text, completed, id}) {
  const li = document.createElement("li");
  li.className = "p-[15px] border-b border-[#ededed] flex items-center group";
  li.insertAdjacentHTML(
    "afterbegin",
    `
     <div data-todo="toggle" class="mr-[15px] rounded-full size-10 border ${completed ? "border-green-500" : ""} flex justify-center items-center">
        <svg class="${completed ? "" : "hidden"} text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      ${text} 
      <svg data-todo="delete" class="ml-auto cursor-pointer hidden group-hover:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    `,
  );
  li.setAttribute("data-id", id);
  return li;
}

const toggleTheme = (isDarkModeToChange) => {
  if (isDarkModeToChange) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  toggleThemeEl.innerHTML = isDarkModeToChange ? darkThemeIcon : lightThemeIcon;

  isDarkMode = isDarkModeToChange;

  localStorage.setItem("isDarkMode", isDarkModeToChange);
};

const renderApp = async () => {
  const hash = window.location.hash;
  const filter = document.getElementById("filter");

  for (const el of filter.children) {
    if (el.matches(`[href="${hash}"]`)) {
      el.classList.add("border");
    } else {
      el.classList.remove("border");
    }
  }
  
  const filteredTodos = todos.filter((todo) => {
    if (hash === "#/active") {
      return !todo.completed;
    } 
    if (hash === "#/completed") {
      return todo.completed;
    } 
      return true;
  });

  list.replaceChildren(...filteredTodos.map((todo) => createTodoItemEl(todo))); // render UI from todos

  counter.innerHTML = `${getCountLeft()} item left`;

  toggleTheme(isDarkMode);

  if (list.children.length > 0) {
    const toggleAllEl = `<svg id="toggle-all" class="cursor-pointer dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-chevron-down">
      <path d="m6 9 6 6 6-6" />
    </svg>`;

    toggle.innerHTML = toggleAllEl;

    const toggleAll = document.getElementById("toggle-all");

    toggleAll.onclick = () => {
      const isAllChecked = Array.from(list.children).every((el) =>
        el.classList.contains("line-through"),
      );

      if (isAllChecked) {
        for (const el of list.children) {
          el.classList.remove("line-through");
          el.querySelector("div").classList.remove("border-green-500");
          el.querySelector("svg").classList.add("hidden");
        }

        return;
      }

      for (const el of list.children) {
        if (!el.classList.contains("line-through")) {
          el.classList.add("line-through");
          el.querySelector("div").classList.add("border-green-500");
          el.querySelector("svg").classList.remove("hidden");
        }
      }
      counter.innerHTML = `${getCountLeft()} item left`;
    };

    input.classList.remove(["shadow-2xl"]);
    footer.classList.remove(["hidden"]);
  }
};

input.onkeyup = async (e) => {
  if (e.key === "Enter") {

    const todo = await createTodo({
      text: input.value,
      completed: false,
    });

    todos.push({
      id : todo.id,
      text: input.value,
      completed: false,
    });
    
    input.value = "";

    renderApp();
  }
};

list.onclick = async(e) => {
  if (e.target.getAttribute("data-todo") === "delete") {
    const id = e.target.parentElement.getAttribute("data-id");
    await deleteTodo(id);
    todos = todos.filter((todo) => todo.id !== id);
    renderApp();
  }

  if (e.target.getAttribute("data-todo") === "toggle") {
    const id = e.target.parentElement.getAttribute("data-id");
    const todo = todos.find((todo) => todo.id === id);
    await toggleTodo(id, !todo.completed);
    todo.id = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo,);
    renderApp();
  }

  counter.innerHTML = `${getCountLeft()} item left`;
};

clearCompleted.onclick =async () => {
  await Promise.all(todos.filter((todo) => todo.completed).map((todo) => deleteTodo(todo.id)));
  todos = todos.filter((todo) => todo.completed).map((todo)=> deleteTodo(todo.id));
  
todos = todos.filter((todo) => !todo.completed);

  renderApp();
};  

toggleThemeEl.onclick = () => {
  toggleTheme(!isDarkMode);
};

fetchTodos().then((data) => {
  todos = data;
  renderApp();
});

window.addEventListener("hashchange", renderApp);
