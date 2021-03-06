/**
 * Un dossier conteneur d'images
 */
 class Folder {

    /**@type {Array.<Photo>} */
    photos;

    /**
     * 
     * @param {string} name le nom du dossier
     * @param {string} subject Le sujet des photos, est utilisé lors de la génération d'images aléatoires. Plusieurs sujets peuvent etre séléctionnés en les séparant par une virgule
     * @param {Folder} parentFolder Le dossier parent. Peut être null si il est le dossier racine.
     * @param {CallableFunction} onAdd
     */
    constructor(name, subject, parentFolder, onAdd) {
        this.photos = [];
        this.name = name;
        this.parentFolder = parentFolder;
        this.subject = subject;
        this.folders = [];
        this.onAdd = onAdd;
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

    
 
    callAdd(Photo){
        if(this.onAdd!=undefined && this.onAdd!= null){
            this.onAdd(Photo);
        }
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
     * @param {string} subject le sujet de l'image pour le choix aléatoire, plusieur sujets peuvent etre choisis si ils sont séparés par une virgule
     * @param {string} forceImg Un lien d'image. Si fourni, l'image ne sera pas aléatoire et le reste des arguments est ignoré.
     * @param {CallableFunction} onDelete 
     */
    constructor(seed, width, height, subject, forceImg, onDelete) {
        this.seed = seed;
        this.width = width;
        this.height = height;
        this.subject = subject;
        this.forceImg = forceImg;
        this.onDelete = onDelete;
    }


    /**
     * Get le lien de l'image
     */
    get link() {

        if (this.forceImg != undefined && this.forceImg != null)
            return this.forceImg;

        return `https://loremflickr.com/${this.width}/${this.height}/${this.subject}/all?lock=${this.seed}`
    }

    /**
     * Calls onDelete if it isn't undefined nor null
     */
   callDelete(){
    if(this.onDelete!= undefined && this.onDelete!= null){
        this.onDelete();
    }
   }
    
}
