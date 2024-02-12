import random
import pygame
import settings

# Constants
GRAY = (50, 50, 50)
LIGHT_GRAY = (128, 128, 128)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GOLD = (255, 215, 0)


class Target:
    def __init__(self):
        self.radius = settings.TARGET_RADIUS
        self.x = random.randint(self.radius, settings.SCREEN_WIDTH - self.radius)
        self.y = random.randint(self.radius + settings.STATUS_HEIGHT, settings.SCREEN_HEIGHT - self.radius)
        self.value = 1 if random.randint(1, 10) != 1 else 5
        self.color = RED if self.value == 1 else GOLD

    def update(self, screen):
        self.radius -= settings.TARGET_SHRINK
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius)
        pygame.draw.circle(screen, WHITE, (self.x, self.y), self.radius * 2 / 3)
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius / 3)
        return self.radius > 0


if __name__ == '__main__':
    # Initialize pygame
    pygame.init()
    size = (settings.SCREEN_WIDTH, settings.SCREEN_HEIGHT)
    display = pygame.display.set_mode(size)
    pygame.display.set_caption("Aim Trainer")
    clock = pygame.time.Clock()
    font = pygame.font.Font(None, 36)

    # Game variables
    run = True
    pause = False
    pause_time = 0
    targets = [Target()]
    time = 0
    spawn_timer = 0
    score = 0
    lives = settings.STARTING_LIVES

    # -------- Main Program Loop -----------
    while run:
        # --- Main event loop
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1 and not pause:
                # Check if player clicked on any target on left clicks
                for target in targets:
                    x_diff = abs(event.pos[0] - target.x)
                    y_diff = abs(event.pos[1] - target.y)
                    if x_diff < target.radius and y_diff < target.radius:
                        score += target.value
                        targets.remove(target)
                        break
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    # Quit game
                    run = False
                elif event.key == pygame.K_p:
                    # Pause game
                    if pause:
                        time -= pygame.time.get_ticks() - pause_time
                    else:
                        pause_time = pygame.time.get_ticks()
                    pause = not pause
        if pause:
            continue

        # Update status display
        display.fill(LIGHT_GRAY)
        pygame.draw.rect(display, GRAY, (0, 0, settings.SCREEN_WIDTH, settings.STATUS_HEIGHT))
        timer_text = font.render(f'Time: {time / 1000 // 60:0>2.0f}:{time / 1000 % 60:0>4.1f}', True, WHITE)
        display.blit(timer_text, (10, (settings.STATUS_HEIGHT - font.get_height()) / 2))
        speed_text = font.render(f'Speed: {score / time * 1000 if time > 0 else 0:.1f}tps', True, WHITE)
        display.blit(speed_text, (settings.SCREEN_WIDTH / 4 + 10, (settings.STATUS_HEIGHT - font.get_height()) / 2))
        lives_text = font.render(f'Lives: {lives}', True, WHITE)
        display.blit(lives_text, (settings.SCREEN_WIDTH / 2 + 10, (settings.STATUS_HEIGHT - font.get_height()) / 2))
        score_text = font.render(f'Score: {score}', True, WHITE)
        display.blit(score_text, (settings.SCREEN_WIDTH * 3 / 4 + 10, (settings.STATUS_HEIGHT - font.get_height()) / 2))

        # Update targets on screen
        for target in targets:
            if not target.update(display):
                targets.remove(target)
                lives -= 1
        pygame.display.flip()

        # Check if no more lives
        if lives <= 0:
            print('Game Over!')
            run = False

        # Create new target
        tick = clock.tick(settings.FPS)
        time += tick
        spawn_timer += tick
        if spawn_timer >= settings.SPAWN_TIME:
            targets.append(Target())
            spawn_timer = 0

    # Close the window and quit.
    pygame.quit()
