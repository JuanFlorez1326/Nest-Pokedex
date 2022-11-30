import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId } from 'mongoose'

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto) 
      return pokemon;
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll() {
    try {
      const data: Pokemon[] = await this.pokemonModel.find() 
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon
    try {
      
      if( !isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: term })
      } 

      //MONGOID
      if( !pokemon && isValidObjectId (term) ) {
        pokemon = await this.pokemonModel.findById(term)
      }

      //NAME
      if( !pokemon ) {
        pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
      }

      if( !pokemon ) {
        throw new NotFoundException(`Pokemon with id, name or no ${ term } not found.`)
      }
        
      return pokemon;
    }
    catch (error) {
      console.log(error);
    }
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne( term );
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toString()
      }
      await pokemon.updateOne(updatePokemonDto)
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    try {
      const pokemon = await this.findOne( id )
      const deletedPokemon = await pokemon.deleteOne()
      return deletedPokemon;
    } catch (error) {
      this.handleExceptions()
    }
  }

  private handleExceptions( error: any ) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemin exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon`)
  }
}
