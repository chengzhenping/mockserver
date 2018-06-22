export function updateItem(array, id, updatedItem){
    //更新某一个item
    const updatedItems = array.map(item => {
        if(item.id !== id) {
            return item;
        }
        return updatedItem;
    });

    return updatedItems;
}
export function updateItemByOld(array, oldItem, updatedItem){
    //更新某一个item,没有ID的情况
    const updatedItems = array.map(item => {
        if(item !== oldItem) {
            return item;
        }
        return updatedItem;
    });

    return updatedItems;
}
export function updateMatchedItem(array, obj,condition){
    //更新所有符合条件的item
    const updatedItems = array.map(item => {
        let passed = true;
        for(let k in condition){
            if(item[k] !== condition[k]){
                passed = false
            }
        }
        if(passed){
            for(let i in obj){
                item[i] = obj[i];
            }
        }
        return item;
    });

    return updatedItems;
}
export function updateAll(array, obj){
    //更新所有item
    const updatedItems = array.map(item => {
        for(let key in obj){
            item[key] = obj[key];
        }
        return item;
    });

    return updatedItems;
}
export function removeItem(array, delItem){
    //删除item
    const updatedItems = array.filter(item => {
        return item !== delItem;
    });

    return updatedItems;
}
export function removeMatchedItem(array, condition) {
  //更新所有符合条件的item
  const updatedItems = array.filter(item => {
    let passed = true;
    for(let k in condition){
      if(item[k] !== condition[k]){
        passed = false
      }
    }
    if(passed){
      return false
    }
    return true;
  });
  return updatedItems;
}
export function removeMuti(array, muti){
    //删除多个item
    const updatedItems = array.filter(item => {
        let isIn = muti.some((i)=>item === i);
        return !isIn;
    });

    return updatedItems;
}
export function addItem(array, item,unshift = false){
    //增加item
    if(array.find(i=>i===item)) return array;//重复的
    let copy = [...array];
    if(unshift){
        copy.unshift(item);
    }else{
       copy.push(item);
        }


    return copy;
}
export function addMuti(array, muti,unshift = false){
    //增加多条
    muti = muti.filter(i=>{
        if(i.id){
           return !array.some(j=>j.id===i.id)
        }else{
            return !array.some(j=>j===i)
        }

    });//去重
    let copy = [...array,...muti];
    if(unshift){
        copy = [...muti,...array]
    }

    return copy;
}
