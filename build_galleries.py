import json
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
GALLERY_DIRS = ("nos-femelles", "mariages", "nos-chatons")
IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}


def main():
    galleries = {}
    for folder in GALLERY_DIRS:
        directory = ROOT / folder
        if not directory.is_dir():
            raise FileNotFoundError(f"Le dossier de galerie est introuvable : {directory}")

        images = sorted(
            (
                image
                for image in directory.iterdir()
                if image.is_file() and image.suffix.lower() in IMAGE_EXTENSIONS
            ),
            key=lambda image: image.name.casefold(),
        )
        galleries[folder] = [
            f"{folder}/{quote(image.name)}"
            for image in images
        ]

    manifest = ROOT / "galleries.json"
    manifest.write_text(
        json.dumps(galleries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Galeries mises à jour : {manifest.name}")
    for folder, images in galleries.items():
        print(f"  {folder}: {len(images)} photo(s)")


if __name__ == "__main__":
    main()
