package io.money.server

import org.springframework.boot.CommandLineRunner
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Bean
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter

@SpringBootApplication
class MoneyIoServerApplication {
    @Bean
    fun init(repository: BuddyRepository) = CommandLineRunner {
        repository.save(Buddy("Jack"))
        repository.save(Buddy("Chloe"))
        repository.save(Buddy("Kim"))
        repository.save(Buddy("David"))
        repository.save(Buddy("Michelle"))
    }

    @Bean
    fun repositoryRestConfigurer(): RepositoryRestConfigurer {
        return object : RepositoryRestConfigurerAdapter() {
            override fun configureRepositoryRestConfiguration(config: RepositoryRestConfiguration) {
                config.exposeIdsFor(Buddy::class.java)
            }
        }
    }
}

fun main(args: Array<String>) {
    SpringApplication.run(MoneyIoServerApplication::class.java, *args)
}
