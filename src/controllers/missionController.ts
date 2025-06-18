import { Request, Response } from 'express';
import { MissionService } from '../services/missionService';

const missionService = new MissionService();

export const MissionController = {
  async getAllMissions(req: Request, res: Response) {
    try {
      const missions = await missionService.getAllMissions();
      res.json(missions);
    } catch (error: any) {
      console.error('Erro ao buscar missões:', error);
      res.status(500).json({ error: error.message || 'Erro ao buscar missões.' });
    }
  },

  async getMissionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const mission = await missionService.getMissionById(id);
      if (!mission) {
        return res.status(404).json({ message: 'Missão não encontrada.' });
      }
      res.json(mission);
    } catch (error: any) {
      console.error('Erro ao buscar missão por ID:', error);
      res.status(400).json({ error: error.message || 'Erro ao buscar missão.' });
    }
  },

  async createMission(req: Request, res: Response) {
    try {
      const { title, description, category, requiredCategories } = req.body;
      const mission = await missionService.createMission({ title, description, category, requiredCategories });
      res.status(201).json(mission);
    } catch (error: any) {
      console.error('Erro ao criar missão:', error);
      res.status(400).json({ error: error.message || 'Erro ao criar missão.' });
    }
  },

  async updateMission(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, description, category, requiredCategories } = req.body;
      const updatedMission = await missionService.updateMission(id, { title, description, category, requiredCategories });
      res.json(updatedMission);
    } catch (error: any) {
      console.error('Erro ao atualizar missão:', error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar missão.' });
    }
  },

  async deleteMission(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await missionService.deleteMission(id);
      res.json({ message: 'Missão deletada com sucesso.' });
    } catch (error: any) {
      console.error('Erro ao deletar missão:', error);
      res.status(400).json({ error: error.message || 'Erro ao deletar missão.' });
    }
  }
};
