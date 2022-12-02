import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId } from 'mongoose'
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto) 
      return pokemon;
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll( paginationDto: PaginationDto) {
    try {

      const { limit = this.defaultLimit, offset = 0 } = paginationDto;

      const data = await this.pokemonModel.find()
        .limit(limit)
        .skip(offset)
        .sort({ no: 1 })
        .select('-__v');
        
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
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id ${ id } not found.`)
    return 
  }

  private handleExceptions( error: any ) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemin exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon`)
  }
}