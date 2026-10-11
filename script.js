const title = document.getElementById("title");
const des = document.getElementById("textarea");
const btn = document.getElementById("btn");
const show = document.getElementById("show");

//Add task
btn.addEventListener("click", () => {
  createTodo(title, des);
  title.value = "";
  des.value = "";
});

// show data
show.addEventListener("click", () => {
  showData();
});

// Show data
async function showData() {
  try {
    const response = await fetch("https://api.freeapi.app/api/v1/todos");

    if (!response.ok) {
      console.log("error ") + response.status;
    }

    const all_data = await response.json();
    let num = 1;
    all_data.data.forEach((element) => {
      console.log("Task = " + num);

      console.log("ID = " + element._id);
      console.log("Title = " + element.title);
      console.log("description = " + element.description);
      num = num + 1;
    });
  } catch (error) {
    console.log(error);
  }
}

// create todo and Add task
async function createTodo(title, des) {
  try {
    // this is add task url formeting.
    const add = await fetch("https://api.freeapi.app/api/v1/todos/", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value,
        description: des.value,
      }),
    });
    if (!add.ok) {
      console.log("error status is = " + add.status);
    }
    const show = await add.json();

    console.log(show);
  } catch (error) {
    console.log("something went wrong = " + error);
  }
}

// update todo .
async function updateTodo() {
  try {
    const update = await fetch(
      "https://api.freeapi.app/api/v1/todos/6acb6cec2817d4d583faa540",
      {
        method: "PATCH",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Updated Task",
          description: "this is Updated task add",
        }),
      },
    );

    if (!update.ok) {
      console.log("error status = " + update.status);
      return;
    }
    const show = await update.json();
    console.log(show);
  } catch (error) {
    console.log("something went wrong = " + error);
  }
}

// Delete task

async function deletetask() {
  try {
    const dlt = await fetch(
      "https://api.freeapi.app/api/v1/todos/6acb7a9835f4e2d334560cb8",
      { method: "DELETE" },
    );

    if (!dlt.ok) {
      console.log("error status = " + dlt.status);
      return;
    }
    const show = await dlt.json();
    console.log(show);
  } catch (error) {
    console.log("something went wrong = " + error);
  }
}
