
let viewModel = new NormalViewModel();

GenerateTestFolders();

async function GenerateTestFolders(){
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
    
    let jsonFolder = await viewModel.makeJsonPlaceholderFolder(16,mainFolder);
    
    mainFolder.folders.push(jsonFolder);
    viewModel.openFolder(mainFolder);
}







//?? Gestion des boutons
document.querySelector("#HomeButton").addEventListener("click", () => {
    viewModel.openFolder(mainFolder);
    
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





//?? Fonctions associ??es aux boutons et aux windows

function putImages(){
    for(const container of document.querySelectorAll("#images .imgcontainer")){
        container.classList.toggle("selectedformove",false);
    }

    for(const img of viewModel.selectedMovePhotos){
        if(img[0] == viewModel.currentFolder){
            
            continue;
        }
        else{
          let index=  img[0].photos.findIndex(a=> img[1]== a);
          img[0].photos.splice(index,1);
          img[1].callDelete();
          viewModel.currentFolder.photos.push(img[1])
          viewModel.currentFolder.callAdd(img[1]);
        }
    }
    viewModel.selectedMovePhotos = [];
}

function okayUploadImage() {
    let photo = new Photo(0, 0, 0, null, imageUploader.querySelector("input").value);
    viewModel.currentFolder.photos.push(photo);
    viewModel.currentFolder.callAdd(photo);
    viewModel.displayImages(viewModel.currentFolder);
    
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

        let currentFolder = viewModel.currentFolder;
        let folder = new Folder(input, null, currentFolder);

        currentFolder.folders.push(folder);
        viewModel.openFolder(currentFolder);
        
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
//? Fin des fonctions associ??es aux boutons et aux windows