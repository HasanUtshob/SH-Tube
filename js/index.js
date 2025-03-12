function showloader() {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("showVideos").classList.add("hidden");
}
function hideloader() {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("showVideos").classList.remove("hidden");
}

function removeActiveClass() {
  let activeButtons = document.getElementsByClassName("active");

  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }

  // console.log(activeButtons);
  // activeButtons.classList.remove("active");
}

// fecth data catogories

function loadCatagories() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((response) => response.json())
    .then((data) => loadCata(data.categories));
}
function loadCata(categories) {
  //   console.log(categories);
  const catagoriesButton = document.getElementById("catagories-container");

  for (let cat of categories) {
    const div = document.createElement("div");
    div.innerHTML = `
    
    <button id="btn-${cat.category_id}" onclick="loadBtn(${cat.category_id})" class="btn btn-sm">${cat.category}</button>
    
    `;

    catagoriesButton.appendChild(div);
  }
}

const loadBtn = (id) => {
  showloader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  console.log(url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const clickedButton = document.getElementById(`btn-${id}`);
      clickedButton.classList.add("active");
      showVideos(data.category);
    });
};

// fetch data Videos

const loadVideos = (serachText = "") => {
  showloader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${serachText}`
  )
    .then((video) => video.json())
    .then((videos) => {
      removeActiveClass();
      document.getElementById("btn-all").classList.add("active");
      showVideos(videos.videos);
    });
};

function showVideoDetails(videoId) {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => videoDetails(data.video));
}

function videoDetails(videoDetails) {
  document.getElementById("videoDetails").showModal();

  const videoDetail = document.getElementById("details-container");
  videoDetail.innerHTML = `
  
  <div class="card bg-base-100 image-full shadow-sm">
  <figure>
    <img
      src="${videoDetails.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${videoDetails.title}</h2>
    <h4> ${videoDetails.authors[0].profile_name} </h4>
    <h5> ${videoDetails.authors[0].verified} </h5>
    <p>${videoDetails.description}</p>
    <div class="card-actions justify-end">
    </div>
  </div>
</div>
  
  `;
  console.log(videoDetails);
}

const showVideos = (videos) => {
  const videoTamplate = document.getElementById("showVideos");
  videoTamplate.innerHTML = "";

  if (videos.length === 0) {
    videoTamplate.innerHTML = `
         <div
        class="py-20 col-span-full flex flex-col justify-center items-center"
      >
        <img src="img/Icon.png" alt="" />
        <h2 class="text-2xl font-bold">
          Oops!! Sorry, There is no content here
        </h2>
      </div>
    
    `;
    hideloader();
    return;
  }

  videos.forEach((video) => {
    const div = document.createElement("div");
    div.innerHTML = `
    
      <div class="card bg-base-100 shadow-sm">
        <figure class="relative">
          <img class = " w-full h-[150px] object-cover" src="${
            video.thumbnail
          }" alt="Shoes" />
          <span
            class="absolute bottom-2 right-4 bg-black text-white text-sm rounded-sm"
            >3hrs 56 min ago</span
          >
        </figure>

        <div class="flex gap-5 px-2 items-center justify-items-center">
          <div>
            <div class="avatar">
              <div
                class="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2"
              >
                <img
                  src="${video.authors[0].profile_picture}"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 class="text-[20px] font-bold">${video.title}</h2>
            <p class="flex items-center gap-1 text-[#17171770]">
              ${video.authors[0].profile_name}
              ${
                video.authors[0].verified === true
                  ? `              <img
                class="w-5"
                src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000"
                alt=""
              />`
                  : ""
              }
            </p>
            <p class="text-[#17171770]">${video.others.views} views</p>
          </div>
        </div>
        <button onclick="showVideoDetails('${
          video.video_id
        }')" class="btn btn-block">More Details</button>
      </div>
    
    `;
    videoTamplate.append(div);
    hideloader();
  });
};

document.getElementById("search-field").addEventListener("keyup", (e) => {
  const input = e.target.value;
  loadVideos(input);
});

loadCatagories();
