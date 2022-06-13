/**
 * Un dossier conteneur d'images
 */
class Folder {
    /**
     * 
     * @param {string} name le nom du dossier
     * @param {string} subject Le sujet des photos, est utilisé lors de la génération d'images aléatoires. Plusieurs sujets peuvent etre séléctionnés en les séparant par une virgule
     * @param {Folder} parentFolder Le dossier parent. Peut être null si il est le dossier racine.
     */
    constructor(name, subject, parentFolder) {
        this.photos = [];
        this.name = name;
        this.parentFolder = parentFolder;
        this.subject = subject;
        this.folders = [];
    }

    /**
     * Genere des liens d'images lorem ipsum
     * @param {number} amount 
     * @param {number} width 
     * @param {number} height 
     */
    generatePhotos(amount, width, height) {
        
        for (var i = 0; i < amount; i++) {
            let p = new Photo(
                Math.trunc(Math.random() * 5000),
                width,
                height,
                this.subject
            );
            this.photos.push(p);

        }
    }

    /**
     * Fais apparaitres les images sur la page
     */
    displayImages() {
        let imgPanel = document.querySelector("#images");
        imgPanel.innerHTML = "";
        for (const img of this.photos) {
            imgPanel.appendChild(img.makeElement());
        }
    }

    /**
     * Fais apparaitre les images sur la page et mets en place le menu lateral
     */
    openFolder() {
        let h2 = document.querySelector("#folderName");
        h2.textContent = this.name;
        let leftNavBar = document.querySelector("#leftNavBar");
        let toclear = leftNavBar.querySelectorAll(".folderPanel");
        let curr = 0;
        for (const folder of toclear) {
            curr++;
            if (curr == 1) {

                folder.folder = this.parentFolder;
                let textDiv = folder.querySelector(".textDiv");

                if (this.parentFolder == null) {
                    textDiv.querySelector("p").textContent = "";
                    continue;
                }
                else {
                    if (!textDiv.hasEvent) {
                        textDiv.hasEvent = true;
                        textDiv.addEventListener("click", () => {
                            folder.folder.openFolder();
                        });
                    }
                }

                textDiv.querySelector("p").textContent = this.parentFolder.name;


                continue;
            }
            folder.remove();


        }


        for (const folder of this.folders) {
            addDossier(folder.name, folder);
        }



        this.displayImages();

    }

}

/**
 * une image
 */
class Photo {
    /**
     * 
     * @param {number} seed un entier qui sert à choisir l'image aléatoire
     * @param {number} width un entier pour la largeur de l'image
     * @param {number} height  un entier pour la hauteur de l'image
     * @param {string} subject le sujet de l'image pour le choix aléatoire, plusieur sujets peuvent etre choisis si ils sont spéarés par une virgule
     * @param {string} forceImg Un lien d'image. Si fourni, l'image ne sera pas aléatoire et le reste des arguments est ignoré.
     */
    constructor(seed, width, height, subject, forceImg) {
        this.seed = seed;
        this.width = width;
        this.height = height;
        this.subject = subject;
        this.forceImg = forceImg;
    }


    /**
     * Get le lien de l'image
     */
    get link() {

        if(this.forceImg!= undefined && this.forceImg!= null)
            return this.forceImg;

        return `https://loremflickr.com/${this.width}/${this.height}/${this.subject}/all?lock=${this.seed}`
    }

    /**
     * Créée un element html pour l'image.
     * @returns L'element img
     */
    makeElement() {
        let l = document.createElement("img");
        l.src = this.link;
        return l;
    }
}



//? Test folders
let mainFolder = new Folder("root", "cat", null);
mainFolder.generatePhotos(12, 480, 270);

let boat = new Folder("Boats", "boat", mainFolder);
let eiffel = new Folder("Eiffel tower", "eiffel,tower", mainFolder);
let dogs = new Folder("Dogs", "dog", mainFolder);

let whiteDogs = new Folder("white ones","dog,white",dogs);

dogs.folders.push(whiteDogs);

whiteDogs.generatePhotos(12,480,270);

boat.generatePhotos(5, 480, 270);
eiffel.generatePhotos(5, 480, 270);
dogs.generatePhotos(5, 480, 270);

mainFolder.folders.push(boat);

mainFolder.folders.push(eiffel);
mainFolder.folders.push(dogs);


mainFolder.openFolder();
//? end of test folders

//? Gestion des boutons
document.querySelector("#HomeButton").addEventListener("click", () =>{
mainFolder.openFolder();
});


let featherMenu = document.querySelector(".featherMenu");
let leftNavBar = document.querySelector("#leftNavBar");

featherMenu.addEventListener("click", menuClick);
//? Fin de la gestion des boutons

/**
 * Ouvre le menu
 */
function menuClick() {
    leftNavBar.classList.toggle("mobileHide");
}

/**
 * Ajoute un dossier au menu lateral
 * @param {string} name le nom du dossier
 * @param {Folder} folder l'objet du dossuer
 */
function addDossier(name, folder) {

    let folderPanel = document.createElement("div");
    folderPanel.classList.add("folderPanel");

    folderPanel.folder = folder;

    let icon = document.createElement("i");
    icon.classList.add("featherfolder");
    icon.setAttribute("data-feather", "folder");
    icon.setAttribute("stroke", "black");
    icon.setAttribute("fill", "#f8d775");

    folderPanel.appendChild(icon);

    let textDiv = document.createElement("div");
    textDiv.classList.add("textDiv");
    folderPanel.appendChild(textDiv);

    textDiv.addEventListener("click", () => {
        folderPanel.folder.openFolder();

    });

    let p = document.createElement("p");
    p.textContent = name;

    textDiv.appendChild(p);

    let minusIcon = document.createElement("i");
    minusIcon.setAttribute("data-feather", "folder-minus");
    minusIcon.classList.add("featherfolderright");

    folderPanel.appendChild(minusIcon);

    document.querySelector("main #leftNavBar").appendChild(folderPanel);

    feather.replace();

}