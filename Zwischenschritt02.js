/* 
Damit ich nicht alle Bilder einzeln aufrufen muss, erstelle ich ein Array,
in dem alle Bilder gespeichert sind.
*/   

var meineBilder = [
    loadImage("images/breakfast.jpg"),
    loadImage("images/breakfasttwo.jpg"),
    loadImage("images/breakfastthree.jpg"),
    loadImage("images/breakfastfour.jpg"),
    loadImage("images/breakfastfive.jpg"),
    loadImage("images/breakfastsix.jpg"),
    loadImage("images/breakfastseven.jpeg"),
    loadImage("images/breakfasteight.jpg"),
    loadImage("images/breakfastnine.jpg")
    ];

/*
    Klasse für eine Memorykarte
    
    Parameter:
        bildindex:  Index (Position) des Bildes im Bilderarray
        x:          X-Position der Karte
        y:          Y-Position der Karte
        breite:     Breite der Karte
        höhe:       Höhe der Karte
*/

var MemoryCard = function(bildindex,x,y,breite,höhe){
    var mybildindex = bildindex; 
   
    //showPicture standartmäßig auf "false", damit Rückseite angezeigt wird 
    var showPicture = false;
    
    //Sperrung damit nicht alle Karten aufgedeckt werden können (nur 2)
    var lock = false;
    
    
    //Größe von der Karte definieren
    var myx = x;
    var myy = y;
    var mybreite = breite;
    var myhöhe = höhe;
     

    
    // Zeichnet die Karte
    this.draw = function() {

        rect(myx-2,myy-2,mybreite+3,myhöhe+3);
        
        if (mouseIsPressed && 
            mouseX>myx && 
            mouseY>myy && 
            mouseX<(myx+ mybreite) && 
            mouseY<(myy+ myhöhe) &&
            lock === false
            ) {
            showPicture = true;
            //println(mybildindex);
        }
        
        if(showPicture) {
            //Bild zeigen
            image(meineBilder[mybildindex], myx, myy, mybreite, myhöhe); 
        }
    };
    
    //Funktion um Sperrung (lock) zu steuern
    this.setLock = function(status){
        lock = status;
    };
    
    this.getShowPicture = function(){
        //Funktion soll Zustand von showPicure wiedergeben
        return showPicture;
    };
    
    this.getBildIndex = function () {
        //zurückgeben
        return mybildindex;
    };
};

//Klasse fürs Spielfeld
//zeichnet das ganze Spielfeld (alle karten)

var MemoryField = function (x,y,größe){
    var KartenX = x;
    var KartenY = y;
    var Kartengröße = größe;
    var Kartenabstand = 58;
    var MemoryKarten = [];
    var MemoryKartenTreffer = [];
    
    var erzeugeKarten = function(){
        var memoryBilder = [];
        for(var bildNummer = 0; bildNummer<(KartenX*KartenY/2); bildNummer++){
            memoryBilder[bildNummer] = bildNummer;
            //Bilder müssen doppelt enthalten sein
            memoryBilder[bildNummer+(KartenX*KartenY/2)] = bildNummer;
        }
        
        //Schleifen zum Erzeugen (instanziieren) der Karten
        //Schleife für X Achse (von 0-3)
        //"xposition" nimmt um 1 zu 
        var kartenPosition = 0;
        for(var xposition = 0; xposition< KartenX; xposition++){
            for(var yposition = 0; yposition< KartenY; yposition++){
                //Position berechnen
                //wird x*y oft durchgeführt
                var x = (xposition + 1) * Kartenabstand + xposition*Kartengröße;
                var y = (yposition + 1) * Kartenabstand + yposition*Kartengröße;
                //Bilder zufällig auswählen
                //"memoryBilder.length-1" length gibt 16 Bilder zurück bei 4*4
                //Der Zähler geht alleridngs von 0-15 deshalb rechnet man -1
                var bildNummer = round(random(0, memoryBilder.length-1));
                //println(bildNummer  + " : " + memoryBilder[bildNummer]);
                var neueKarte = new MemoryCard(memoryBilder[bildNummer], x, y, Kartengröße, Kartengröße);
                
                //Das Bild muss aus dem Array herausgenommen werden, damit es nicht öfter als 2-mal gezeichnet wird 
                //dafür verwende ich "splice"
                //damit kann man eine gewisse Anzahl an Elementen aus dem Array löschen
                memoryBilder.splice(bildNummer, 1);
                
                //neue Memory Karte im Array speichern
                MemoryKarten[kartenPosition] = neueKarte;
                MemoryKartenTreffer[kartenPosition] = false;
                kartenPosition++;
            }
        }
    };
    
    
    
    this.draw = function(){
        //Schleife in der die draw Funktion für alle Karten aufrufen
        //"kartenNummer" ist die Position im Array
        //"MemoryKarten.length" gibt Anzahl der Karten zurück
        for(var kartenNummer = 0; kartenNummer< MemoryKarten.length; kartenNummer++){
            //eine bestimmte Karte zeichnen
            MemoryKarten[kartenNummer].draw();
        }
        
        //Zählen, wie viele Karten umgedreht sind
        //Speichern in einem Array um zu wissen welche Karten umgedreht sind
        var umgedrehteKarten = [];
        for(var kartenNummer = 0; kartenNummer< MemoryKarten.length; kartenNummer++){
            //Bei jeder Karte überprüfen, ob sie umgedreht ist
            
            if (MemoryKarten[kartenNummer].getShowPicture()){
                //Anzahl umgedrehte Karten um 1 erhöht
                umgedrehteKarten[umgedrehteKarten.length] = MemoryKarten[kartenNummer].getBildIndex();
            }
        }
        
        if(umgedrehteKarten.length>=2){
          for(var kartenNummer = 0; kartenNummer< MemoryKarten.length; kartenNummer++){
             //Jede einzelne Karte durchgehen und sperren damit keine weiteren Karten umgedreht werden können
              MemoryKarten[kartenNummer].setLock(true);
          }
          //Vergleicht Karten -> nulltes Element erstem
          if(umgedrehteKarten[0]===umgedrehteKarten[1]){
              //Gleiche Karten === Treffer
              background(11, 99, 15);
              //treffer ++;
          }
          else{
              //ungleiche Karten === kein Treffer
              background(196, 15, 15);
          }
          
        }
   
    };
    
    erzeugeKarten();
};

//Instanz fürs Spielfeld
var MemoryFeld = new MemoryField(4,4,50);
//Das Bild im Hintergrund
var myImage = loadImage("images/Holztisch.jpg");

//"new" erweckt meine Karte zum Leben (instanziieren)

//var MemoryCardone = new MemoryCard(0, 50, 50, 50, 50);

//var MemoryCardtwo = new MemoryCard(1, 150, 50, 50, 50);
//MemoryCardtwo.setLock(true);

 var draw = function() {
    
    //MemoryCardone aufrufen (draw)
    
    //MemoryCardone.draw();
    //MemoryCardtwo.draw();
    
    
    //Das Bild im Hintergrund
    image(myImage, 0, 0);
    
    MemoryFeld.draw();

 }; 
