export default function Footer({name}){
    return(
    <footer className='w-screen h-10 flex justify-center items-center p-5'>
      <span>
        &copy; {new Date().getFullYear()} Kim Shop {name} - All rights reserved
      </span>
    </footer>
    )
  }