class NormalViewModel{
/**@type {Folder} */
static currentFolder = null;

/**@type {Array.<Array.<(Folder|Photo)>>} */
static selectedMovePhotos = [];



/**
 * Fait apparaitres les images sur la page
 * @param {Folder} folder 
 */
static displayImages(folder) {
    let imgPanel = document.querySelector("#images");
    imgPanel.innerHTML = "";
    for (const img of folder.photos) {
        imgPanel.appendChild(NormalViewModel.makeElement(img));
    }

    for(const img of NormalViewModel.selectedMovePhotos){
        if(img[0]!= NormalViewModel.currentFolder)
            imgPanel.appendChild(NormalViewModel.makeElement(img[1]));
    }

    for(const pic of document.querySelectorAll("#images .imgcontainer")){
        
        for(const img of NormalViewModel.selectedMovePhotos){
            if(img[1] == pic.photo){
                pic.classList.toggle("selectedformove");
                break;
            }
        }
    }

    //! Remplace les <i> avec data-feather par les icones svg correspondantes
    feather.replace();
    //! Necessite <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>

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
           let photoIndex= NormalViewModel.currentFolder.photos.findIndex(a=> a== img.photo);
           NormalViewModel.currentFolder.photos.splice(photoIndex,1);
           img.remove();
        });

        img.querySelector(".feathermoveimage").addEventListener("click",()=>{
            let removed = false;
            let fi = NormalViewModel.selectedMovePhotos.findIndex(a=> a[1] == img.photo);
            if(fi!=-1){
                if(NormalViewModel.selectedMovePhotos[fi][0]!= NormalViewModel.currentFolder){
                    img.remove();
                    removed = true;
                }
                NormalViewModel.selectedMovePhotos.splice(fi,1);

            }
            else{
                NormalViewModel.selectedMovePhotos.push([NormalViewModel.currentFolder,img.photo]);
            }
            if(!removed)
                img.classList.toggle("selectedformove");
        });

    }
}

/**
     * Fais apparaitre les images sur la page et mets en place le menu lateral
     * @param {Folder} folder
     */
static openFolder(folder) {
    NormalViewModel.currentFolder = folder;
    let h2 = document.querySelector("#folderName");
    h2.textContent = folder.name;
    let leftNavBar = document.querySelector("#leftNavBar");
    let toclear = leftNavBar.querySelectorAll(".folderPanel");
    let curr = 0;
    for (const ff of toclear) {
        curr++;
        if (curr == 1) {

            ff.folder = folder.parentFolder;
            let textDiv = ff.querySelector(".textDiv");

            if (folder.parentFolder == null) {
                textDiv.querySelector("p").textContent = "";
                continue;
            }
            else {
                if (!textDiv.hasEvent) {
                    textDiv.hasEvent = true;
                    textDiv.addEventListener("click", () => {
                        NormalViewModel.openFolder(ff.folder);
                    });
                }
            }
            textDiv.querySelector("p").textContent = folder.parentFolder.name;
            continue;
        }
        ff.remove();
    }
    for (const ff of folder.folders) {
        NormalViewModel.addDossier(ff.name, ff);
    }
    NormalViewModel.displayImages(folder);
}


/**
     * Créée un element html pour l'image.
     * @param {Photo}photo 
     * @returns L'element img
     */
static makeElement(photo) {

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
    l.src = photo.link;
    
    div.append(l,trash2,max2,move2,trash,max,move);


    div.photo = photo;


    return div;
}



/**
 * Ajoute un dossier au menu lateral
 * @param {string} name le nom du dossier
 * @param {Folder} folder l'objet du dossuer
 */
 static addDossier(name, folder) {

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
        NormalViewModel.openFolder(folderPanel.folder);
        

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



}