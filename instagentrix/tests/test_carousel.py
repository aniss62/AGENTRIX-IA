# instagentrix/tests/test_carousel.py
import sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from PIL import Image
from instagentrix.carousel import generate_carousel
from instagentrix.brand import CAROUSEL_W, CAROUSEL_H

def test_generates_one_file_per_slide():
    slides = [
        "3 erreurs qui coutent des heures a votre PME chaque semaine",
        "Erreur 1 : repondre aux memes questions clients a la main",
        "Erreur 2 : recopier des leads d'un fichier vers un autre",
        "Un agent IA peut regler les trois en moins d'une semaine",
    ]
    with tempfile.TemporaryDirectory() as tmp:
        paths = generate_carousel(slides, Path(tmp), slug="test-post")
        assert len(paths) == len(slides)
        for p in paths:
            assert p.exists()
            img = Image.open(p)
            assert img.size == (CAROUSEL_W, CAROUSEL_H)

if __name__ == "__main__":
    test_generates_one_file_per_slide()
    print("OK")
