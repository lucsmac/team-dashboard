import 'dotenv/config';
import { PrismaClient } from './generated/prisma/index.js';
import { initialData } from './data/initialData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  try {
    // Limpar dados existentes (cuidado em produção!)
    console.log('🗑️  Clearing existing data...');
    await prisma.timelineTask.deleteMany();
    await prisma.highlight.deleteMany();
    await prisma.delivery.deleteMany();
    await prisma.demand.deleteMany();
    await prisma.dev.deleteMany();
    await prisma.config.deleteMany();

    // Inserir devs
    console.log('👥 Seeding devs...');
    for (const dev of initialData.devs) {
      await prisma.dev.create({
        data: {
          id: dev.id,
          name: dev.name,
          color: dev.color,
          role: dev.role,
          seniority: dev.seniority,
          lastWeek: dev.lastWeek,
          thisWeek: dev.thisWeek,
          nextWeek: dev.nextWeek
        }
      });
    }
    console.log(`✅ Created ${initialData.devs.length} devs`);

    // Inserir demands
    console.log('📋 Seeding demands...');
    let demandCount = 0;
    for (const [category, demands] of Object.entries(initialData.demands)) {
      for (const demand of demands) {
        await prisma.demand.create({
          data: {
            id: demand.id,
            category,
            title: demand.title,
            status: demand.status,
            priority: demand.priority,
            stage: demand.stage,
            assignedDevs: demand.assignedDevs,
            value: demand.value,
            details: demand.details,
            links: demand.links || []
          }
        });
        demandCount++;
      }
    }
    console.log(`✅ Created ${demandCount} demands`);

    // Inserir deliveries
    console.log('🚀 Seeding deliveries...');
    for (const delivery of initialData.deliveries) {
      await prisma.delivery.create({
        data: {
          id: delivery.id,
          title: delivery.title,
          valueType: delivery.valueType,
          items: delivery.items
        }
      });
    }
    console.log(`✅ Created ${initialData.deliveries.length} deliveries`);

    // Inserir highlights
    console.log('⭐ Seeding highlights...');
    let highlightCount = 0;

    // Blockers
    for (const blocker of initialData.highlights.blockers) {
      await prisma.highlight.create({
        data: {
          id: blocker.id,
          type: 'blockers',
          text: blocker.text,
          severity: blocker.severity
        }
      });
      highlightCount++;
    }

    // Important
    for (const info of initialData.highlights.important) {
      await prisma.highlight.create({
        data: {
          id: info.id,
          type: 'important',
          text: info.text,
          severity: info.type
        }
      });
      highlightCount++;
    }

    // Achievements
    for (const achievement of initialData.highlights.achievements) {
      await prisma.highlight.create({
        data: {
          id: achievement.id,
          type: 'achievements',
          text: achievement.text
        }
      });
      highlightCount++;
    }
    console.log(`✅ Created ${highlightCount} highlights`);

    // Inserir timeline tasks
    console.log('📅 Seeding timeline...');
    let taskCount = 0;

    // Current week tasks
    for (const task of initialData.timeline.currentWeek.tasks) {
      await prisma.timelineTask.create({
        data: {
          id: task.id,
          weekType: 'current',
          weekStart: new Date(task.deadline || initialData.timeline.currentWeek.startDate),
          weekEnd: new Date(initialData.timeline.currentWeek.endDate),
          title: task.title,
          priority: task.priority,
          status: task.status,
          progress: task.progress,
          assignedDevs: task.assignedDevs,
          deadline: task.deadline ? new Date(task.deadline) : null,
          deliveryStage: task.deliveryStage || null,
          demandId: task.demandId || null,
          category: task.category,
          highlights: task.highlights || [],
          blockers: task.blockers || []
        }
      });
      taskCount++;
    }

    console.log(`✅ Created ${taskCount} timeline tasks`);

    // Inserir config
    console.log('⚙️  Seeding config...');
    await prisma.config.create({
      data: {
        key: 'week',
        value: initialData.week
      }
    });

    await prisma.config.create({
      data: {
        key: 'priorities',
        value: initialData.priorities
      }
    });

    await prisma.config.create({
      data: {
        key: 'currentWeek',
        value: {
          startDate: initialData.timeline.currentWeek.startDate,
          endDate: initialData.timeline.currentWeek.endDate,
          alerts: initialData.timeline.currentWeek.alerts || [],
          notes: initialData.timeline.currentWeek.notes || ''
        }
      }
    });

    await prisma.config.create({
      data: {
        key: 'previousWeek',
        value: initialData.timeline.previousWeek
      }
    });

    await prisma.config.create({
      data: {
        key: 'upcomingWeeks',
        value: initialData.timeline.upcomingWeeks
      }
    });

    console.log('✅ Created config');

    console.log('\n✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
