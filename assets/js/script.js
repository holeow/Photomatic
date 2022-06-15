//? Test folders
let mainFolder = new Folder("root", "cat", null);
mainFolder.generatePhotos(12, 480, 270);

let boat = new Folder("Boats", "boat", mainFolder);
let eiffel = new Folder("Eiffel tower", "eiffel,tower", mainFolder);
let dogs = new Folder("Dogs", "dog", mainFolder);

let whiteDogs = new Folder("white ones", "dog,white", dogs);

dogs.folders.push(whiteDogs);

whiteDogs.generatePhotos(12, 480, 270);

boat.generatePhotos(5, 480, 270);
eiffel.generatePhotos(5, 480, 270);
dogs.generatePhotos(5, 480, 270);

mainFolder.folders.push(boat);

mainFolder.folders.push(eiffel);
mainFolder.folders.push(dogs);


mainFolder.openFolder();
//? end of test folders

//? Gestion des boutons
document.querySelector("#HomeButton").addEventListener("click", () => {
    mainFolder.openFolder();
});


let featherMenu = document.querySelector(".featherMenu");
let leftNavBar = document.querySelector("#leftNavBar");

featherMenu.addEventListener("click", menuClick);

let featherPlus = document.querySelector(".blueOne .featherfolderright");

featherPlus.addEventListener("click", createFolderClick)

let folderCreator = document.querySelector("#folderCreator");

folderCreator.querySelector(".buttons .cancel").addEventListener("click", closeAllWindows);

folderCreator.querySelector(".buttons .okay").addEventListener("click", okayCreateFolder);

folderCreator.querySelector("input").addEventListener("keyup", event => {
    if (event.key === "Enter") okayCreateFolder();
})

let uploadbutton = document.querySelector("#featherUpload");
uploadbutton.addEventListener("click", openUploadWindow);

let imageUploader = document.querySelector("#imageUploader");

imageUploader.querySelector(".buttons .cancel").addEventListener("click", closeAllWindows);
imageUploader.querySelector(".buttons .okay").addEventListener("click", okayUploadImage);

imageUploader.querySelector("input").addEventListener("keyup", event => {
    if (event.key === "Enter") okayUploadImage();
});

document.querySelector(".feathercloseimage").addEventListener("click", () => {
let imgScreen = document.querySelector("#imgScreen");
imgScreen.classList.toggle("transparent");
setTimeout(()=> imgScreen.classList.toggle("isHidden"), 800);
});


let putbutton = document.querySelector("#featherput");
putbutton.addEventListener("click",putImages );

//? Fin de la gestion des boutons

function putImages(){
    for(const container of document.querySelectorAll("#images .imgcontainer")){
        container.classList.toggle("selectedformove",false);
    }

    for(const img of Folder.selectedMovePhotos){
        if(img[0] == Folder.currentFolder){
            
            continue;
        }
        else{
          let index=  img[0].photos.findIndex(a=> img[1]== a);
          img[0].photos.splice(index,1);
          Folder.currentFolder.photos.push(img[1]);
        }
    }
    Folder.selectedMovePhotos = [];
}

function okayUploadImage() {
    let photo = new Photo(0, 0, 0, null, imageUploader.querySelector("input").value);
    Folder.currentFolder.photos.push(photo);
    Folder.currentFolder.displayImages();
    closeAllWindows();
}

function closeAllWindows() {
    let windows = document.querySelectorAll(".inWindow");

    for (const win of windows) {
        win.classList.toggle("isHidden", true);
    }
}

function openUploadWindow(event) {
    event.preventDefault();
    closeAllWindows();
    let input = imageUploader.querySelector("input");
    input.value = "";
    imageUploader.classList.toggle("isHidden");
    input.focus();


}

function okayCreateFolder() {


    let input = folderCreator.querySelector("input").value;

    if (input.length > 0) {

        let currentFolder = Folder.currentFolder;
        let folder = new Folder(input, null, currentFolder);

        currentFolder.folders.push(folder);
        currentFolder.openFolder();
        createFolderClick();
        closeAllWindows();
    }

}

function createFolderClick() {
    closeAllWindows();
    folderCreator.classList.toggle("isHidden");
    folderCreator.querySelector("input").value = "";
    folderCreator.querySelector("input").focus();

}



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