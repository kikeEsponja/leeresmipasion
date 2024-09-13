async function getAllSubjects(){
  try{
    const response = await fetch('https://leeresmipasion.com:3005/api/subjects');
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subjects = await response.json();
    return subjects;
  }catch (error){
    console.error('error al obtener los subjects', error);
    return[];
  }
}

async function updateCarousel(){
  this.carouselElement.innerHTML = '';

  const subjects = await getAllSubjects();

  const subjectList = document.createElement('ul');
  subjects.forEach(subject =>{
    const listItem = document.createElement('li');
    listItem.textContent = subject;
    subjectList.appendChild(listItem);
  });
  document.getElementById('bookDetails').appendChild(subjectList);
}