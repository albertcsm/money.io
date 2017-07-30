package io.money.server

import org.springframework.data.repository.CrudRepository

interface BuddyRepository : CrudRepository<Buddy, String> {
    fun findByName(name: String): List<Buddy>
}