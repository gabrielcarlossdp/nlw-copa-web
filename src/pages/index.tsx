interface HomeProps {
  countPools: number,
  countGuess: number,
  countUser: number
}

import appPreviewImg from '../assets/copa-nlw-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExpample from '../assets/uesr-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'

import Image from 'next/image'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const {code} = response.data
      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, código foi copiado para área de transferencia')

      setPoolTitle('')

    } catch (err) {
      alert('Falha ao criar o bolão, tente novamente')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="logo" quality={100} />
        <h1 className='my-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExpample} alt="logo" quality={100} />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.countUser}</span> pessoas já estão usando
          </strong>
        </div>
        <form className='mt-10 flex gap-2' onSubmit={createPool}>
          <input className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-white' type="text" required placeholder='Qual nome do seu bolão?' onChange={event => setPoolTitle(event.target.value)} value={poolTitle} />
          <button className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold uppercase text-sm hover:bg-yellow-700' type='submit'>Criar meu Bolão</button>
        </form>

        <p className='text-gray-300 mt-4 text-sm  leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" quality={100} />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.countPools}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='w-px h-12 bg-gray-600'></div>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" quality={100} />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.countGuess}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="Imagem do celulares" quality={100} />
    </div>
  )
}

export const getServerSideProps = async () => {

  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      countPools: poolCountResponse.data.count,
      countGuess: guessCountResponse.data.count,
      countUser: userCountResponse.data.count,
    }
  }
}
