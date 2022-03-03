/* 
Functions
Author: Stijn De Bels
Description: Functions used throughout the thesis.
Stylesheet: /
Functions in this component:
- matchKey:
    - Inputarguments: objectToSearch, keyToFind
    - finds all the propertynames of object "objecttosearch" that start with the keyToFind word
    - Outputarguments: echteArray, containing all propertynames
- rijtuigbepaling
    - Inputarguments: prop, data, key, typeAfbeelding, rijtuigLengteAfbeelding
    - Prop is an element of data. Key is the propertyname of Prop.
    - first this key search if there is a specific type image of the carriage available
    - if not, it looks at the properties and creates a fitting image, and checks if there is an image of the specific length available in rijtuigLengteafbeelding
- JSONtoData:
    - input: JSON data array.
    - creates an object array and returns it as output
*/
export function matchKey(objectToSearch, keyToFind) {
    let echteArray=[];
    let i=0;
    for (let k in objectToSearch) {
        if ( k.startsWith(keyToFind)) 
        {
              echteArray[i]=k;
              i++;          
        }
    }
    return echteArray;
  }

export function rijtuigBepaling(prop, data, key, typeAfbeelding, rijtuigLengteAfbeelding)
{
    let filename=0;
    let noTouch=false
    if (typeAfbeelding[prop.lastPlanned_materialUnits_materialSubTypeName])
    {
        filename=typeAfbeelding[prop.lastPlanned_materialUnits_materialSubTypeName]
    }                  
    else 
    {
    let argument="";
    
    if (prop.lastPlanned_materialUnits_isFirstClass=='WAAR' && prop.lastPlanned_materialUnits_isSecondClass=='ONWAAR' && (key==0 || ((key!=(data).length && key!=0)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key-1].lastPlanned_materialUnits_tractionPosition))))
    {
        
        argument="train-firstC1"
    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='WAAR' && prop.lastPlanned_materialUnits_isSecondClass=='ONWAAR' && (key==(data).length-1  || ((key+1!=(data).length)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key+1].lastPlanned_materialUnits_tractionPosition))))
    {
        
        argument='train-lastC1'
    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='ONWAAR' && prop.lastPlanned_materialUnits_isSecondClass=='WAAR' && (key==0 || ((key!=(data).length && key!=0)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key-1].lastPlanned_materialUnits_tractionPosition))))
    {
        argument='train-firstC2'

    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='ONWAAR' && prop.lastPlanned_materialUnits_isSecondClass=='WAAR'  && (key==(data).length-1  || ((key+1!=(data).length)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key+1].lastPlanned_materialUnits_tractionPosition))))
    {
        argument='train-lastC2'
    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='ONWAAR' && prop.lastPlanned_materialUnits_isSecondClass=='ONWAAR' && (key==0 || ((key!=(data).length && key!=0)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key-1].lastPlanned_materialUnits_tractionPosition))))
    {
        argument='train-firstnone'
        noTouch=true;
    }
    else if (prop.lastPlanned_materialUnits_isFirstClass=='ONWAAR' && prop.lastPlanned_materialUnits_isSecondClass=='ONWAAR' && (key==(data).length-1  || ((key+1!=(data).length)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key+1].lastPlanned_materialUnits_tractionPosition))))
    {
        argument='train-lastnone'
        noTouch=true;
    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='WAAR' && prop.lastPlanned_materialUnits_isSecondClass=='WAAR' && (key==0 || ((key!=(data).length && key!=0)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key-1].lastPlanned_materialUnits_tractionPosition))))
    {
        argument='train-firstC12'
    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='WAAR' && prop.lastPlanned_materialUnits_isSecondClass=='WAAR' && (key==(data).length-1  || ((key+1!=(data).length)  && (prop.lastPlanned_materialUnits_tractionPosition!=data[key+1].lastPlanned_materialUnits_tractionPosition))))
    {
        argument='train-lastC21'


    }
    else if  (prop.lastPlanned_materialUnits_isFirstClass=='WAAR')
    {
        argument='train-C1'

    }
    else if  (prop.lastPlanned_materialUnits_isSecondClass=='WAAR')
    {
        argument='train-C2'

    }
    if (argument)
    {
        if((rijtuigLengteAfbeelding[((data[key].Length))]!=undefined) && (argument in rijtuigLengteAfbeelding[((data[key].Length))]))
        {
            filename=rijtuigLengteAfbeelding[((data[key].Length))][argument];
        }
        else
        {
        filename=rijtuigLengteAfbeelding["general"][argument]
        }
    }
    else
    {
        return;
    }
    }
    return [filename, noTouch]
}

export function JSONtodata (specifics)
{
  let i=0;
  var specificsA;
  var specificsAr = [specifics.length];
  for(let i = 0; i < specifics.length; i++)
  { 
      if (specifics === null) {
          specifics = [ ];
      }
      else
      {
          specificsA=specifics[i];
          specificsA = JSON.parse(specificsA);
          specificsAr[i]=specificsA;
      }
  }
  return specificsAr
}
