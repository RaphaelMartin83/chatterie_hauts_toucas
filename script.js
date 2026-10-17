const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    siteNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const galleries = [...document.querySelectorAll(".carousel")];

function renderGallery(gallery, photos) {
  const status = gallery.querySelector(".carousel__status");
  if (!status) {
    throw new Error("A gallery is missing its status element.");
  }

  if (photos.length === 0) {
    status.textContent = `Aucune photo pour le moment. Ajoutez vos photos dans le dossier « ${gallery.dataset.gallery}/ », puis actualisez la page.`;
    return;
  }

  const figure = document.createElement("figure");
  figure.className = "carousel__figure";

  const image = document.createElement("img");
  image.className = "carousel__image";
  image.loading = "lazy";
  image.addEventListener("error", () => {
    const error = new Error(`Could not load gallery image: ${image.src}`);
    console.error(error);
    status.hidden = false;
    status.textContent = "Cette photo n’a pas pu être chargée. Vérifiez que le fichier est une image prise en charge.";
  });

  const caption = document.createElement("figcaption");
  caption.className = "carousel__caption";
  figure.append(image, caption);

  const controls = document.createElement("div");
  controls.className = "carousel__controls";

  const previous = document.createElement("button");
  previous.className = "carousel__button";
  previous.type = "button";
  previous.setAttribute("aria-label", "Photo précédente");
  previous.textContent = "←";

  const counter = document.createElement("span");
  counter.className = "carousel__counter";
  counter.setAttribute("aria-live", "polite");

  const next = document.createElement("button");
  next.className = "carousel__button";
  next.type = "button";
  next.setAttribute("aria-label", "Photo suivante");
  next.textContent = "→";

  controls.append(previous, counter, next);
  gallery.append(figure, controls);

  let currentIndex = 0;
  const showPhoto = () => {
    const photoUrl = photos[currentIndex];
    const fileName = decodeURIComponent(photoUrl.split("/").pop() ?? photoUrl);
    image.src = photoUrl;
    image.alt = `${gallery.getAttribute("aria-label")} : ${fileName}`;
    caption.textContent = fileName;
    counter.textContent = `${currentIndex + 1} / ${photos.length}`;
  };

  previous.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    showPhoto();
  });

  next.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % photos.length;
    showPhoto();
  });

  status.textContent = "";
  status.hidden = true;
  showPhoto();
}

if (galleries.length > 0) {
  fetch("/galleries.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gallery request failed with status ${response.status}.`);
      }
      return response.json();
    })
    .then((manifest) => {
      for (const gallery of galleries) {
        const photos = manifest[gallery.dataset.gallery];
        if (!Array.isArray(photos)) {
          throw new Error(`Missing photo list for gallery "${gallery.dataset.gallery}".`);
        }
        renderGallery(gallery, photos);
      }
    })
    .catch((error) => {
      console.error("Could not load photo galleries.", error);
      for (const gallery of galleries) {
        const status = gallery.querySelector(".carousel__status");
        if (status) {
          status.textContent = "Impossible de charger les photos. Vérifiez que le site est lancé avec « python3 server.py », puis actualisez la page.";
        }
      }
    });
}
