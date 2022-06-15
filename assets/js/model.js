/**
 * Un dossier conteneur d'images
 */
 class Folder {

//Todo n'est pas sensé être là
    /** @type {Folder}  */
    static currentFolder = null;
//Todo n'est pas sensé être là
    /**@type {Array.<Array.<(Folder|Photo)>>} */
    static selectedMovePhotos = [];

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

    // Todo : déplacer en dehors de cette classe
    /**
     * Fais apparaitres les images sur la page
     */
    displayImages() {
        let imgPanel = document.querySelector("#images");
        imgPanel.innerHTML = "";
        for (const img of this.photos) {


            imgPanel.appendChild(img.makeElement());
        }

        for(const img of Folder.selectedMovePhotos){
            if(img[0]!= Folder.currentFolder)
                imgPanel.appendChild(img[1].makeElement());
        }

        for(const pic of document.querySelectorAll("#images .imgcontainer")){
            
            for(const img of Folder.selectedMovePhotos){
                if(img[1] == pic.photo){
                    
                    pic.classList.toggle("selectedformove");
                    break;
                }
                
            }
        }
        feather.replace();

        let imgs = document.querySelectorAll(".imgcontainer");
        for(const img of imgs) {

            img.querySelector("img").addEventListener("click", () =>{
                img.classList.toggle("imageclicked");
            });
            img.querySelector(".feathermaximizeimage").addEventListener("click",()=>{

                let imgScreen = document.querySelector("#imgScreen");
                imgScreen.querySelector( "img").src = img.photo.link;
                imgScreen.classList.toggle("isHidden");
                setTimeout(() => imgScreen.classList.toggle("transparent") ,1);
                
            });

            img.querySelector(".featherdeleteimage").addEventListener("click",()=>{
               let photoIndex= Folder.currentFolder.photos.findIndex(a=> a== img.photo);
               Folder.currentFolder.photos.splice(photoIndex,1);
               img.remove();
            });

            img.querySelector(".feathermoveimage").addEventListener("click",()=>{
                let removed = false;
                let fi = Folder.selectedMovePhotos.findIndex(a=> a[1] == img.photo);
                if(fi!=-1){
                    if(Folder.selectedMovePhotos[fi][0]!= Folder.currentFolder){
                        img.remove();
                        removed = true;
                    }
                    Folder.selectedMovePhotos.splice(fi,1);

                }
                else{
                    Folder.selectedMovePhotos.push([Folder.currentFolder,img.photo]);
                }
                if(!removed)
                    img.classList.toggle("selectedformove");
            });

        }
    }

    // Todo : déplacer en dehors de cette classe
    /**
     * Fais apparaitre les images sur la page et mets en place le menu lateral
     */
    openFolder() {
        Folder.currentFolder = this;
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

        if (this.forceImg != undefined && this.forceImg != null)
            return this.forceImg;

        return `https://loremflickr.com/${this.width}/${this.height}/${this.subject}/all?lock=${this.seed}`
    }

    // Todo : déplacer en dehors de cette classe
    /**
     * Créée un element html pour l'image.
     * @returns L'element img
     */
    makeElement() {

        let div = document.createElement('div');
        div.classList.add("imgcontainer");

        let trash = document.createElement("i");
        trash.setAttribute("data-feather", "trash-2");
        trash.classList.add("featherdeleteimage");
        trash.classList.add("appearonimghover");

        let trash2 = document.createElement("i");
        trash2.setAttribute("data-feather", "trash-2");
        trash2.classList.add("featherdeleteimage2");
        trash2.classList.add("appearonimghover");

        let max = document.createElement("i");
        max.setAttribute("data-feather", "maximize-2");
        max.classList.add("feathermaximizeimage");
        max.classList.add("appearonimghover");

        let max2 = document.createElement("i");
        max2.setAttribute("data-feather", "maximize-2");
        max2.classList.add("feathermaximizeimage2");
        max2.classList.add("appearonimghover");

        let move = document.createElement("i");
        move.setAttribute("data-feather", "move");
        move.classList.add("feathermoveimage");
        move.classList.add("appearonimghover");

        let move2 = document.createElement("i");
        move2.setAttribute("data-feather", "move");
        move2.classList.add("feathermoveimage2");
        move2.classList.add("appearonimghover");


        let l = document.createElement("img");
        l.src = this.link;
        div.appendChild(l);
        
        div.appendChild(trash2);
        div.appendChild(max2);
        div.appendChild(move2);
        div.appendChild(trash);
        div.appendChild(max);
        div.appendChild(move);
        


        div.photo = this;


        return div;
    }
}
