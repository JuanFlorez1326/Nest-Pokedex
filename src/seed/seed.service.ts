import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async executeSeed() {

    //Elimina todo de la base de datos.
    await this.pokemonModel.deleteMany({})

    //URL de la API
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=650'

    //Obtiene los primeros 10 pokemones de la API con Axios
    const { data } = await this.axios.get<PokeResponse>(url)

    //Array para guardar los pokemones en la base de datos
    const pokemonToInsert: { name: string, no: number }[] = []

    //Mapea los resultados de la API y los guarda en la base de datos
    data.results.forEach ( ({ name, url }) => {

      //Obtiene el número del pokemon
      const segments = url.split('/')

      //Convertir el número a entero
      const no = +segments [segments.length - 2]

      //Guarda el pokemon en el array
      pokemonToInsert.push({ name, no })
    })

    //Guarda los pokemones en la base de datos
    await this.pokemonModel.insertMany(pokemonToInsert)
    return 'Seed executed';
  }
}